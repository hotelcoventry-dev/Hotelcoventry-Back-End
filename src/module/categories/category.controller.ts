import { Controller, Get, Post, Body, Param, Patch, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('seeder')
  async addCategories(): Promise<string> {
    return await this.categoryService.addCategories();
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of categories per page (default: 3)',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search categories by partial name match (case-insensitive)',
  })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida con éxito' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
    @Query('name') name?: string,
  ): Promise<{ data: Category[]; total: number; pages: number }> {
    return this.categoryService.findAll(page, limit, name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la categoría' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una categoría por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada con éxito' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
