import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dni: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  direccion: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column()
  cuit: string;

  @Column({ nullable: true })
  imagenDni?: string;

  @OneToMany(() => Booking, (booking) => booking.client)
  bookings: Booking[];
}
