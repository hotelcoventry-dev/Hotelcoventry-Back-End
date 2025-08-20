import { Module } from '@nestjs/common';
import { ProductsModule } from './module/products/products.module';
import { BookingModule } from './module/booking/booking.module';

@Module({
  imports: [ProductsModule, BookingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
