import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

export enum EstadoHabitacion {
  LIBERADA = 'LIBERADA',
  RESERVADA = 'RESERVADA',
  OCUPADA = 'OCUPADA',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: string;

  @Column()
  tipo: string;

  @Column({ type: 'enum', enum: EstadoHabitacion, default: EstadoHabitacion.LIBERADA })
  estado: EstadoHabitacion;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
