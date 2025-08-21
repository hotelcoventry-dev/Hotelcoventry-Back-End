import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, EstadoHabitacion } from './entities/room.entity';
import { Booking } from '../booking/entities/booking.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async create(roomData: Partial<Room>): Promise<Room> {
    const room = this.roomRepo.create(roomData);
    return await this.roomRepo.save(room);
  }

  async findAll(status?: string): Promise<Room[]> {
    const query = this.roomRepo.createQueryBuilder('room').leftJoinAndSelect('room.bookings', 'booking');

    if (status) {
      query.where('room.estado = :status', { status });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepo.findOne({ where: { id }, relations: ['bookings'] });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async findAvailable(): Promise<Room[]> {
    return await this.roomRepo.find({
      where: { estado: EstadoHabitacion.LIBERADA },
      relations: ['bookings'],
    });
  }
}
