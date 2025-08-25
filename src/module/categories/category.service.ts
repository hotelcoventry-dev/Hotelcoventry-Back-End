// src/categories/category.service.ts
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import { data } from '../../seed-data';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async addCategories(): Promise<string> {
    const categoriesNames = new Set(data.map((element) => element.category));
    const categoriesArray = Array.from(categoriesNames);

    const categories = categoriesArray.map((category) => ({
      name: category,
      description: `Categoría de ${category}`,
    }));

    await this.categoryRepository.upsert(categories, ['name']);
    return 'Categorías precargadas';
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const categoryExists = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
      if (categoryExists) throw new BadRequestException(`La categoría '${createCategoryDto.name}' ya existe`);

      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error desconocido al crear categoría');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 3,
    name?: string,
  ): Promise<{ data: Category[]; total: number; pages: number }> {
    try {
      if (page < 1) {
        throw new BadRequestException('El número de página debe ser mayor o igual a 1');
      }
      if (limit < 1) {
        throw new BadRequestException('El límite debe ser mayor o igual a 1');
      }

      const skip = (page - 1) * limit;

      const query = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.products', 'products');

      if (name) {
        query.where('LOWER(category.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
      }

      const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

      if (data.length === 0) {
        throw new NotFoundException('No se encontraron categorías');
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
      throw new InternalServerErrorException('Error al obtener las categorías');
    }
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const nameExists = await this.categoryRepository.findOne({ where: { name: updateCategoryDto.name } });
      if (nameExists) throw new BadRequestException(`La categoría '${updateCategoryDto.name}' ya existe`);
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    try {
      await this.categoryRepository.remove(category);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('No se pudo eliminar la categoría, puede estar asociada a productos');
    }
  }
}
