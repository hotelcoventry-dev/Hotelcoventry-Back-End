import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entities/room.entity';
import { Booking } from '../booking/entities/booking.entity';
import { AuthsModule } from '../auths/auths.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Booking]), AuthsModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
