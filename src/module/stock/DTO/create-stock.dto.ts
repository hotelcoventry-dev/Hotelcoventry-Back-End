import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID del producto asociado al stock',
  })
  @IsNotEmpty()
  @IsUUID()
  product_Id: string;

  @ApiProperty({
    example: 100,
    description: 'Cantidad actual en stock',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 10,
    description: 'Cantidad mínima permitida antes de alerta de reposición',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  min_quantity: number;
}
