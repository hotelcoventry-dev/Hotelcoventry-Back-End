import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingWithClientDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { Booking, EstadoReserva } from './entities/booking.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guards';
import { RoleGuard } from 'src/guards/auth.guards.admin';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('booking')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Create a booking' })
  @ApiResponse({ status: 201, description: 'Booking successfully created', type: Booking })
  @ApiResponse({ status: 404, description: 'Client or room not found' })
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async create(@Body() dto: CreateBookingWithClientDto): Promise<Booking> {
    return await this.bookingService.createWithClient(dto);
  }

  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking successfully canceled', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the booking to cancel' })
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelBookingDto): Promise<Booking> {
    return await this.bookingService.cancel(id, dto);
  }

  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'estado', enum: EstadoReserva, required: false, description: 'Filter by booking status' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of items per page' })
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  findAll(
    @Query('estado') estado?: EstadoReserva,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    return this.bookingService.findAll(estado, +page, +limit);
  }

  @ApiOperation({ summary: 'Find bookings by client' })
  @ApiResponse({ status: 200, description: 'Bookings for the client', type: [Booking] })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the client' })
  @UseGuards(AuthGuard, RoleGuard)
  @Get('client/:id')
  async findByClient(@Param('id', ParseIntPipe) clientId: number): Promise<Booking[]> {
    return await this.bookingService.findByClient(clientId);
  }

  @ApiOperation({ summary: 'Find a booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking found', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the booking' })
  @UseGuards(AuthGuard, RoleGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return await this.bookingService.findOne(id);
  }
}
