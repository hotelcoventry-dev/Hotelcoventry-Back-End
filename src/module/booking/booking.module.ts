import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Room } from '../room/entities/room.entity';
import { Client } from './entities/client.entity';
import { AuthsModule } from '../auths/auths.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room, Client]), AuthsModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
