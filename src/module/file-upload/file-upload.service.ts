import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Product } from '../products/entities/product.entity';
import { cloudinary } from '../../config/cloudinary';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async uploadFile(file: Express.Multer.File, product_Id: string): Promise<File> {
    if (!file) throw new BadRequestException('No se ha proporcionado un archivo');

    const product = await this.productRepository.findOne({
      where: { id: product_Id },
    });
    if (!product) throw new NotFoundException(`Producto con id ${product_Id} no encontrado`);

    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      throw new BadRequestException('Formato de archivo inválido. Solo se permiten jpg, jpeg, png o webp');
    }

    if (file.size > 200 * 1024 * 1024) {
      throw new BadRequestException('El archivo no puede superar los 2MB');
    }

    try {
      const result = await new Promise<any>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          {
            folder: `products/${product_Id}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(new Error(typeof error === 'string' ? error : JSON.stringify(error)));
            } else {
              resolve(result);
            }
          },
        );

        Readable.from(file.buffer).pipe(upload);
      });

      const fileEntity = this.fileRepository.create({
        fileName: file.originalname,
        url: result.secure_url,
        mimeType: file.mimetype,
        publicId: result.public_id,
        product,
      });

      return await this.fileRepository.save(fileEntity);
    } catch (error) {
      throw new BadRequestException(`Error subiendo archivo a Cloudinary: ${error.message}`);
    }
  }

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!file) throw new NotFoundException(`Archivo con id ${id} no encontrado`);
    return file;
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);

    try {
      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: 'image',
      });
      await this.fileRepository.remove(file);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Error eliminando archivo');
    }
  }
}
