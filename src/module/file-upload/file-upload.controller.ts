import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Get,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import * as multer from 'multer';
import { File } from './entities/file.entity';

@ApiTags('Files')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload/:product_Id')
  @ApiOperation({ summary: 'Subir una imagen asociada a un producto' })
  @ApiParam({ name: 'product_Id', type: String, description: 'UUID del producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al subir el archivo' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_Id', ParseUUIDPipe) product_Id: string,
  ): Promise<File> {
    return this.fileUploadService.uploadFile(file, product_Id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las imágenes subidas' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Cantidad de imágenes por página (default: 5)',
  })
  @ApiResponse({ status: 200, description: 'Lista de imágenes obtenida con éxito' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{ data: File[]; total: number; pages: number }> {
    return this.fileUploadService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una imagen por ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<File> {
    return this.fileUploadService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una imagen por ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.fileUploadService.remove(id);
  }
}
