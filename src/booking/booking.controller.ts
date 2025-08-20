import { Controller, Post, Body, Put, Param, Get, Query, ParseIntPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { Booking, EstadoReserva } from './entities/booking.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiResponse({ status: 201, description: 'Reserva creada con éxito', type: Booking })
  @ApiResponse({ status: 404, description: 'Cliente o habitación no encontrados' })
  async create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return await this.bookingService.create(dto);
  }

  @Put(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada con éxito', type: Booking })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async cancel(@Param('id', ParseIntPipe) id: number, @Body() dto: CancelBookingDto): Promise<Booking> {
    return await this.bookingService.cancel(id, dto);
  }

  @Get()
  @ApiQuery({ name: 'estado', enum: EstadoReserva, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  findAll(
    @Query('estado') estado?: EstadoReserva,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    return this.bookingService.findAll(estado, +page, +limit);
  }

  @Get('cliente/:id')
  @ApiOperation({ summary: 'Buscar reservas por cliente' })
  @ApiResponse({ status: 200, description: 'Reservas del cliente', type: [Booking] })
  async findByClient(@Param('id', ParseIntPipe) clienteId: number): Promise<Booking[]> {
    return await this.bookingService.findByClient(clienteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar una reserva por ID' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: Booking })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return await this.bookingService.findOne(id);
  }
}
