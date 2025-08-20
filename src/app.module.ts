import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [ProductsModule, BookingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
