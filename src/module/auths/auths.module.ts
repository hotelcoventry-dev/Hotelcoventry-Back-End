import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { AuthsService } from './auths.service';
import { AuthsController } from './auths.controller';
import { AuthGuard } from '../../guards/auth.guards';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/Entyties/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SUPABASE_JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthsService, AuthGuard],
  controllers: [AuthsController],
  exports: [JwtModule, AuthGuard, AuthsService],
})
export class AuthsModule {}
