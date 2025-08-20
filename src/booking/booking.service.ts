import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, EstadoReserva } from './entities/booking.entity';
import { Room, EstadoHabitacion } from './entities/room.entity';
import { Client } from './entities/client.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const client = await this.clientRepo.findOneBy({ id: dto.clientId });
    if (!client) throw new NotFoundException('Cliente no encontrado');

    const room = await this.roomRepo.findOneBy({ id: dto.roomId });
    if (!room) throw new NotFoundException('Habitación no encontrada');

    if (room.estado !== EstadoHabitacion.LIBERADA) {
      throw new Error('La habitación no está disponible');
    }

    const booking = this.bookingRepo.create({
      fechaReserva: dto.fechaReserva,
      fechaIngreso: dto.fechaIngreso,
      fechaSalida: dto.fechaSalida,
      sena: dto.sena,
      client,
      room,
      estado: EstadoReserva.RESERVADA,
    });

    room.estado = EstadoHabitacion.RESERVADA;
    await this.roomRepo.save(room);

    return await this.bookingRepo.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepo.find({ relations: ['client', 'room'] });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['client', 'room'] });
    if (!booking) throw new NotFoundException('Reserva no encontrada');
    return booking;
  }

  async findByClient(clientId: number): Promise<Booking[]> {
    const client = await this.clientRepo.findOneBy({ id: clientId });
    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return await this.bookingRepo.find({
      where: { client },
      relations: ['client', 'room'],
    });
  }

  async cancel(id: number, dto: CancelBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id }, relations: ['room'] });
    if (!booking) throw new NotFoundException('Reserva no encontrada');

    booking.estado = EstadoReserva.CANCELADA;
    booking.motivoCancelacion = dto.motivo;

    booking.room.estado = EstadoHabitacion.LIBERADA;
    await this.roomRepo.save(booking.room);

    return await this.bookingRepo.save(booking);
  }
}
