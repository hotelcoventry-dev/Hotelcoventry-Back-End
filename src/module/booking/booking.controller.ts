import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { Booking } from './entities/booking.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Reserva creada exitosamente', type: Booking })
  @Post()
  create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.create(dto);
  }

  @ApiOperation({ summary: 'Cancelar una reserva existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reserva' })
  @ApiBody({ type: CancelBookingDto })
  @ApiResponse({ status: 200, description: 'Reserva cancelada correctamente', type: Booking })
  @Put(':id/cancelar')
  cancel(@Param('id') id: number, @Body() dto: CancelBookingDto): Promise<Booking> {
    return this.bookingService.cancel(id, dto);
  }

  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({ status: 200, description: 'Lista de reservas', type: [Booking] })
  @Get()
  findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada', type: Booking })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Get('client/:id')
  @ApiOperation({ summary: 'Buscar reservas por cliente' })
  @ApiResponse({ status: 200, description: 'Lista de reservas del cliente', type: [Booking] })
  findByClient(@Param('id') clienteId: number): Promise<Booking[]> {
    return this.bookingService.findByClient(clienteId);
  }
}
