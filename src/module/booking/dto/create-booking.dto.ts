import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateBookingWithClientDto {
  @ApiProperty({ example: 1, description: 'ID of the room to be booked' })
  @IsInt()
  roomId: number;

  @ApiProperty({ example: '2025-09-01', description: 'Booking date' })
  @IsDateString()
  fechaReserva: string;

  @ApiProperty({ example: '2025-09-01', description: 'Check-in date' })
  @IsDateString()
  fechaIngreso: string;

  @ApiProperty({ example: '2025-09-05', description: 'Check-out date' })
  @IsDateString()
  fechaSalida: string;

  @ApiProperty({ example: 2, description: 'Number of people' })
  @IsInt()
  @Min(1)
  Personas: number;

  @ApiProperty({ example: 200.0, description: 'Amount paid by client (must be at least 10%)' })
  @IsNumber()
  @Min(0)
  montoPagado: number;

  @ApiProperty({ example: 1, description: 'Client ID (if already exists)', required: false })
  @IsOptional()
  clientId?: number;

  @ApiProperty({ example: 'Juan', required: false })
  @IsOptional()
  nombre?: string;

  @ApiProperty({ example: 'Perez', required: false })
  @IsOptional()
  apellido?: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsOptional()
  dni?: string;

  @ApiProperty({ example: 'test@mail.com', required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+541112345678', required: false })
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 'Calle Falsa 123', required: false })
  @IsOptional()
  direccion?: string;

  @ApiProperty({ example: '20-12345678-9', required: false })
  @IsOptional()
  cuit?: string;

  @ApiProperty({ example: 'dni.jpg', required: false })
  @IsOptional()
  imagenDni?: string;
}
