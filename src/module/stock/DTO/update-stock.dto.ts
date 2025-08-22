import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID del producto asociado al stock',
  })
  product_Id?: string;

  @ApiPropertyOptional({
    example: 150,
    description: 'Nueva cantidad en stock',
    minimum: 0,
  })
  quantity?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Nueva cantidad mínima de reposición',
    minimum: 0,
  })
  min_quantity?: number;
}
