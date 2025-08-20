import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from './client.entity';
import { Room } from './room.entity';

export enum EstadoReserva {
  RESERVADA = 'RESERVADA',
  CANCELADA = 'CANCELADA',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.bookings, { eager: true })
  client: Client;

  @ManyToOne(() => Room, (room) => room.bookings, { eager: true })
  room: Room;

  @Column({ type: 'date' })
  fechaReserva: Date;

  @Column({ type: 'date' })
  fechaIngreso: Date;

  @Column({ type: 'date' })
  fechaSalida: Date;

  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.RESERVADA })
  estado: EstadoReserva;

  @Column('decimal', { precision: 10, scale: 2 })
  sena: number;

  @Column({ nullable: true })
  motivoCancelacion?: string;
}
