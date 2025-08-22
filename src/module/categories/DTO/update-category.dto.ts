import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    example: 'Electrónica',
    description: 'Nombre actualizado de la categoría',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Categoría de productos electrónicos',
    description: 'Descripción actualizada de la categoría',
  })
  description?: string;
}
