import { IsNotEmpty, IsOptional, IsNumber, IsUUID, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Remera Oversize',
    description: 'Nombre del producto',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Remera de algodón 100%, corte amplio',
    description: 'Descripción detallada del producto',
    required: false,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1999.99,
    description: 'Precio del producto',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID de la categoría a la que pertenece el producto',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Cantidad inicial de stock (por defecto: 0)',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  initialStock?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Cantidad mínima de stock antes de alerta (por defecto: 5)',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;
}
