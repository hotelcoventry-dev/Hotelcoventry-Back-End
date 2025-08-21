import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AuthsService } from './auths.service';
import { CreateUserDto, LoginUserDto } from '../users/Dtos/CreateUserDto';
import { AuthResponse } from './interface/IAuth.interface';
import { ResponseUserDto } from '../users/interface/IUserResponseDto';
import { AuthGuard } from 'src/guards/auth.guards';
import { RoleGuard } from 'src/guards/auth.guards.admin';
import { Roles, UserRole } from 'src/decorator/role.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthsController {
  constructor(
    private readonly authService: AuthsService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully, returns access token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post('signin')
  async signin(@Body() credentials: LoginUserDto): Promise<AuthResponse> {
    return await this.authService.signin(credentials.EmployeeNumber, credentials.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data or email already exists',
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.MANAGER)
  @Post('signup')
  async signup(@Body() newUser: CreateUserDto): Promise<ResponseUserDto> {
    return await this.authService.signup(newUser);
  }
}
