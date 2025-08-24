import { IsOptional, IsNumber, IsString, IsUUID, Min, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductFilterDTO {
  @ApiProperty({ example: '1' })
  @IsDefined({ message: 'page is required' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: '10' })
  @IsDefined({ message: 'limit is required' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'ghphhrewgkg52741rtw43st4' })
  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Remera' })
  @IsOptional()
  @IsString()
  name?: string;
}
