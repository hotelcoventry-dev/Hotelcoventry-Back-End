import { Controller, Post, UseInterceptors, UploadedFile, Param, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import * as multer from 'multer';

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
      storage: multer.memoryStorage(), // 👈 usa memoria, no disco
      limits: { fileSize: 2 * 1024 * 1024 }, // máximo 2MB
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('product_Id', ParseUUIDPipe) product_Id: string) {
    return this.fileUploadService.uploadFile(file, product_Id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las imágenes subidas' })
  findAll() {
    return this.fileUploadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una imagen por ID' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fileUploadService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una imagen por ID' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.fileUploadService.remove(id);
  }
}
