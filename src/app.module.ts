import { Module } from '@nestjs/common';
import { ProductsModule } from './module/products/products.module';
import typeOrmConfig from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { UsersModule } from './module/users/users.module';
import { AuthsModule } from './module/auths/auths.module';
import { BookingModule } from './module/booking/booking.module';
import { RoomModule } from './module/room/room.module';
import { StockModule } from './module/stock/stock.module';
import { CategoryModule } from './module/categories/category.module';
import { FileUploadModule } from './module/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DataSourceOptions>('typeorm');
        if (!config) {
          throw new Error('TypeORM config is missing');
        }
        return config;
      },
    }),
    ProductsModule,
    UsersModule,
    AuthsModule,
    BookingModule,
    RoomModule,
    StockModule,
    CategoryModule,
    FileUploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
