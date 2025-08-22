import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, QueryRunner } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './DTO/createProduct.dto';
import { UpdateProductDto } from './DTO/updateProduct.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.productRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { categoryId, name, initialStock, minStock, ...rest } = createProductDto;

      const category = await queryRunner.manager.findOne(Category, {
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with id ${categoryId} not found`);
      }

      const exists = await queryRunner.manager.findOne(Product, {
        where: { name },
      });
      if (exists) {
        throw new ConflictException(`Product with name "${name}" already exists`);
      }

      const product = queryRunner.manager.create(Product, {
        ...rest,
        name,
        category,
      });

      const savedProduct = await queryRunner.manager.save(Product, product);

      await this.createStockInTransaction(queryRunner, savedProduct.id, initialStock ?? 0, minStock ?? 5);

      await queryRunner.commitTransaction();

      console.log(
        `Product and stock created successfully: ${savedProduct.name} (Stock: ${initialStock ?? 0}, Min: ${minStock ?? 5})`,
      );
      return savedProduct;
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Error) {
        console.error(`Transaction failed:`, error.message);
        throw new InternalServerErrorException(`Error creating product: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error creating product');
    } finally {
      await queryRunner.release();
    }
  }

  private async createStockInTransaction(
    queryRunner: QueryRunner,
    productId: string,
    quantity: number = 0,
    minQuantity: number = 5,
  ): Promise<void> {
    try {
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Product with id ${productId} not found in transaction`);
      }

      const stockData = {
        quantity,
        min_quantity: minQuantity,
        product,
      };

      const stock = queryRunner.manager.create('Stock', stockData);
      await queryRunner.manager.save('Stock', stock);

      console.log(`Stock record created for product: ${product.name} (Qty: ${quantity}, Min: ${minQuantity})`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error creating stock in transaction:`, error.message);
        throw error;
      }
      throw new Error('Unknown error creating stock');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find({
        where: { isDeleted: IsNull() },
        relations: ['category', 'stock', 'files'],
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error fetching products: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error fetching products');
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({
        where: { id, isDeleted: IsNull() },
        relations: ['category', 'stock', 'files'],
      });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error fetching product: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error fetching product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);

      if (updateProductDto.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        });
        if (!category) {
          throw new NotFoundException(`Category with id ${updateProductDto.categoryId} not found`);
        }
        product.category = category;
      }

      Object.assign(product, updateProductDto);
      return await this.productRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error updating product: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error updating product');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const product = await this.findOne(id);
      product.isDeleted = new Date();
      await this.productRepository.save(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(`Error deleting product: ${error.message}`);
      }
      throw new InternalServerErrorException('Unknown error deleting product');
    }
  }
}
