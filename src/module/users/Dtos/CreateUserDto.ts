import { PickType, ApiProperty, ApiHideProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'carli87',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50, {
    message: 'El username debe tener entre 3 y 50 caracteres',
  })
  username: string;

  @ApiProperty({
    description: 'This field must contain the EmployeeNumber of the user',
    example: 1234567890,
  })
  @IsNumber()
  EmployeeNumber: number;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Carli87@',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmación de contraseña',
    example: 'Carli87@',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/, {
    message:
      'La confirmación de contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  confirmPassword: string;

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  isReceptionist?: boolean;

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  isManager?: boolean;

  @ApiHideProperty()
  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;
}

export class LoginUserDto extends PickType(CreateUserDto, ['EmployeeNumber', 'password']) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class CreateUserDbDto extends OmitType(CreateUserDto, ['confirmPassword'] as const) {}

export class UpdateUserDbDto extends OmitType(UpdateUserDto, ['confirmPassword'] as const) {}
