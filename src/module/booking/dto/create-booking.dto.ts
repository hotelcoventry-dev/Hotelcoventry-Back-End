import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: 1,
    description: 'ID del cliente que hace la reserva',
  })
  @IsNumber()
  clientId: number;

  @ApiProperty({
    example: 101,
    description: 'ID de la habitación a reservar',
  })
  @IsNumber()
  roomId: number;

  @ApiProperty({
    example: '2025-08-20',
    description: 'Fecha en la que se genera la reserva',
  })
  @IsDateString()
  fechaReserva: Date;

  @ApiProperty({
    example: '2025-08-25',
    description: 'Fecha de ingreso del cliente',
  })
  @IsDateString()
  fechaIngreso: Date;

  @ApiProperty({
    example: '2025-08-30',
    description: 'Fecha de salida del cliente',
  })
  @IsDateString()
  fechaSalida: Date;

  @ApiProperty({ example: '3', description: 'numero de personas que se hospedaran' })
  @IsNumber()
  Personas: number;

  @ApiProperty({ example: '259.000$', description: 'monto de la reserva ya pago' })
  @IsNumber()
  deposit: number;
}
