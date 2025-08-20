import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    example: true,
    description: 'Define si el usuario será recepcionista o no',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isReceptionist?: boolean;

  @ApiProperty({
    example: true,
    description: 'Define si el usuario será manager o no',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isManager?: boolean;
}
