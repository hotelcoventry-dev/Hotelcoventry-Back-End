import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createProduct.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: 'Remera Regular Fit',
    description: 'Nombre actualizado del producto',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Remera de algodón con corte regular',
    description: 'Descripción actualizada',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 1799.99,
    description: 'Nuevo precio del producto',
  })
  price?: number;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Nuevo UUID de la categoría',
  })
  categoryId?: string;
}
