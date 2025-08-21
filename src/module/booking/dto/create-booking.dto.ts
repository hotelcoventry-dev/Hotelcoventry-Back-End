import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateBookingWithClientDto {
  @ApiProperty({ example: 101, description: 'ID de la habitación a reservar' })
  @IsNumber()
  roomId: number;

  @ApiProperty({ example: '2025-08-20', description: 'Fecha en la que se genera la reserva' })
  @IsDateString()
  fechaReserva: Date;

  @ApiProperty({ example: '2025-08-25', description: 'Fecha de ingreso del cliente' })
  @IsDateString()
  fechaIngreso: Date;

  @ApiProperty({ example: '2025-08-30', description: 'Fecha de salida del cliente' })
  @IsDateString()
  fechaSalida: Date;

  @ApiProperty({ example: 3, description: 'Número de personas que se hospedarán' })
  @IsNumber()
  Personas: number;

  @ApiProperty({ example: 259000, description: 'Monto de la reserva ya pagado' })
  @IsNumber()
  deposit: number;

  @ApiProperty({ example: 1, description: 'ID del cliente existente', required: false })
  @IsOptional()
  @IsNumber()
  clientId?: number;

  @ApiProperty({ example: 'Juan', description: 'Nombre del cliente', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del cliente', required: false })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiProperty({ example: '12345678', description: 'DNI del cliente', required: false })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({ example: 'juan@email.com', description: 'Email del cliente', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456789', description: 'Teléfono del cliente', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del cliente', required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ example: '20-12345678-9', description: 'CUIT del cliente', required: false })
  @IsOptional()
  @IsString()
  cuit?: string;

  @ApiProperty({ example: 'imagen.jpg', description: 'Foto del DNI del cliente', required: false })
  @IsOptional()
  @IsString()
  imagenDni?: string;
}
