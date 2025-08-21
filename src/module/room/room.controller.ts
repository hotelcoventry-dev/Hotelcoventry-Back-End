import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './entities/room.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';
import { RoleGuard } from 'src/guards/auth.guards.admin';
import { CreateRoomDto } from './dto/create-room.dto';

@ApiTags('Rooms')
@ApiBearerAuth()
@Controller('room')
@UseGuards(AuthGuard, RoleGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created', type: Room })
  @Post()
  create(@Body() roomData: CreateRoomDto): Promise<Room> {
    return this.roomService.create(roomData);
  }

  @ApiOperation({ summary: 'Get all rooms with bookings' })
  @ApiQuery({
    name: 'status',
    enum: ['LIBERADA', 'RESERVADA', 'OCUPADA'],
    required: false,
    description: 'Filter by room status',
  })
  @ApiResponse({ status: 200, description: 'List of rooms', type: [Room] })
  @Get()
  findAll(@Query('status') status?: string): Promise<Room[]> {
    return this.roomService.findAll(status);
  }

  @ApiOperation({ summary: 'Get a room by ID with bookings' })
  @ApiResponse({ status: 200, description: 'Room found', type: Room })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Room> {
    return this.roomService.findOne(id);
  }
}
