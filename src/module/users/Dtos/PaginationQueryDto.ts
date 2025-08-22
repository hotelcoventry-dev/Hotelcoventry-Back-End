import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({
    example: 10,
    required: false,
    description: 'The number of items to return per page',
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @Max(100)
  limit = 10;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'The page number to retrieve',
  })
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  page = 1;
}

export class UserSearchQueryDto extends PaginationQueryDto {
  @ApiProperty({
    example: 'john_doe',
    required: false,
    description: 'Username to search for users',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    example: 1234567890,
    required: false,
    description: 'EmployeeNumber to search for users',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  EmployeeNumber?: number;
}
