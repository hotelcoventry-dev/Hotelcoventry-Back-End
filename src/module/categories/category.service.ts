// src/categories/category.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

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

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({ relations: ['products'] });
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
