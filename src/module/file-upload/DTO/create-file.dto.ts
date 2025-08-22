import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    example: 'remera-oversize.png',
    description: 'Nombre del archivo subido',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/v1690000000/remera-oversize.png',
    description: 'URL donde se encuentra alojado el archivo',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    example: 'image/png',
    description: 'Tipo MIME del archivo',
  })
  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @ApiProperty({
    example: 'abc123xyz',
    description: 'Identificador público del archivo en el servicio de almacenamiento',
  })
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID del producto asociado al archivo',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  product_Id: string;
}
