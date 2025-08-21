import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { EstadoHabitacion } from '../entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Room number' })
  @IsString()
  numero: string;

  @ApiProperty({ example: 'Double', description: 'Room type (Single, Double, Suite, etc.)' })
  @IsString()
  tipo: string;

  @ApiProperty({ example: 2, description: 'Maximum number of people the room can accommodate' })
  @IsNumber()
  capacidad: number;

  @ApiProperty({
    example: EstadoHabitacion.LIBERADA,
    description: 'Initial state of the room',
    enum: EstadoHabitacion,
    required: false,
  })
  @IsOptional()
  @IsEnum(EstadoHabitacion)
  estado?: EstadoHabitacion;
}
