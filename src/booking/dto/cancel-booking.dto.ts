import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({
    example: 'El cliente canceló por motivos personales',
    description: 'Motivo de la cancelación de la reserva',
  })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
