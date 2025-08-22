import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Ropa',
    description: 'Nombre de la categoría',
  })
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Categoría que agrupa todos los productos de ropa',
    description: 'Descripción opcional de la categoría',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
