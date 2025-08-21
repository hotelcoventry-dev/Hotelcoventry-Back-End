import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { Client } from './client.entity';

export enum EstadoReserva {
  RESERVADO = 'RESERVADO',
  CANCELADO = 'CANCELADO',
  CONFIRMADO = 'CONFIRMADO',
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaReserva: Date;

  @Column({ type: 'date' })
  fechaIngreso: Date;

  @Column({ type: 'date' })
  fechaSalida: Date;

  @Column()
  Personas: number;

  @Column({ type: 'int', nullable: true })
  noches: number;

  @Column({ type: 'decimal', nullable: true })
  montoTotal: number;

  @Column({ type: 'decimal', nullable: true })
  montoPagado: number;

  @Column({ type: 'decimal', nullable: true })
  saldoPendiente: number;

  @Column({ type: 'enum', enum: EstadoReserva, default: EstadoReserva.RESERVADO })
  estado: EstadoReserva;

  @Column({ nullable: true })
  motivoCancelacion?: string;

  @ManyToOne(() => Client, (client) => client.bookings, { eager: true })
  client: Client;

  @ManyToOne(() => Room, (room) => room.bookings, { eager: true })
  room: Room;
}
