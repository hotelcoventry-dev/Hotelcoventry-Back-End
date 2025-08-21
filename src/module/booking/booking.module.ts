import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Room } from './entities/room.entity';
import {Client} from './entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Room, Client]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
