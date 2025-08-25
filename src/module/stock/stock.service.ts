import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './DTO/create-stock.dto';
import { UpdateStockDto } from './DTO/update-stock.dto';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    const product = await this.productRepository.findOne({ where: { id: createStockDto.product_Id } });
    if (!product) throw new NotFoundException(`Producto con id ${createStockDto.product_Id} no encontrado`);

    const stock = this.stockRepository.create({
      ...createStockDto,
      product,
    });
    return await this.stockRepository.save(stock);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Stock[]; total: number; pages: number }> {
    try {
      // Validaciones
      if (page < 1) {
        throw new BadRequestException('El número de página debe ser mayor o igual a 1');
      }
      if (limit < 1) {
        throw new BadRequestException('El límite debe ser mayor o igual a 1');
      }

      const skip = (page - 1) * limit;

      const [data, total] = await this.stockRepository.findAndCount({
        relations: ['product'],
        skip,
        take: limit,
      });

      if (data.length === 0) {
        throw new NotFoundException('No se encontraron registros de stock');
      }

      const pages = Math.ceil(total / limit);

      return {
        data,
        total,
        pages,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los registros de stock');
    }
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findOne({ where: { id }, relations: ['product'] });
    if (!stock) throw new NotFoundException(`Registro de stock con id ${id} no encontrado`);
    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stock = await this.findOne(id);

    if (updateStockDto.product_Id && updateStockDto.product_Id !== stock.product.id) {
      const product = await this.productRepository.findOne({ where: { id: updateStockDto.product_Id } });
      if (!product) throw new NotFoundException(`Producto con id ${updateStockDto.product_Id} no encontrado`);
      stock.product = product;
    }

    Object.assign(stock, updateStockDto);
    const updatedStock = await this.stockRepository.save(stock);

    if (updatedStock.quantity < updatedStock.min_quantity) {
      console.warn(`Atención: el stock del producto ${updatedStock.product.id} está por debajo del mínimo`);
    }

    return updatedStock;
  }

  async remove(id: string): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }
}
