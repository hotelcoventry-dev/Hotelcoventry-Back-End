// src/stock/stock.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete, ParseUUIDPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './DTO/create-stock.dto';
import { UpdateStockDto } from './DTO/update-stock.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Stock } from './entities/stock.entity';

@ApiTags('Stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de stock' })
  @ApiBody({ type: CreateStockDto })
  @ApiResponse({ status: 201, description: 'Stock creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de stock' })
  @ApiResponse({ status: 200, description: 'Lista de stocks obtenida con éxito' })
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de stock por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del stock' })
  @ApiResponse({ status: 200, description: 'Stock encontrado' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Stock> {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro de stock por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del stock' })
  @ApiBody({ type: UpdateStockDto })
  @ApiResponse({ status: 200, description: 'Stock actualizado con éxito' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.stockService.update(id, updateStockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un registro de stock por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID del stock' })
  @ApiResponse({ status: 200, description: 'Stock eliminado con éxito' })
  @ApiResponse({ status: 404, description: 'Stock no encontrado' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.stockService.remove(id);
  }
}
