import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/Dtos/CreateUserDto';
import { ResponseUserDto } from '../users/interface/IUserResponseDto';
import { AuthValidations } from './validate/auth.validate';
import { AuthResponse, IUserAuthResponse } from './interface/IAuth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/Entyties/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signin(EmployeeNumber: number, password: string): Promise<AuthResponse> {
    AuthValidations.validateCredentials(EmployeeNumber, password);

    const user = await this.findUserByEmployeeNumber(EmployeeNumber);
    AuthValidations.validateUserHasPassword(user);
    await AuthValidations.validatePassword(password, user.password);

    return this.generateAuthResponse(user);
  }

  async signup(data: CreateUserDto): Promise<ResponseUserDto> {
    const { password, confirmPassword, ...userData } = data;

    AuthValidations.validatePasswordMatch(password, confirmPassword);
    const user = await this.userService.findByEmployeeNumber(userData.EmployeeNumber);
    AuthValidations.validateEmployeeNumberNotTaken(user?.EmployeeNumber);
    const existingUser = await this.usersRepository.findOne({
      where: { EmployeeNumber: userData.EmployeeNumber },
      select: ['id', 'EmployeeNumber'],
    });
    if (existingUser) {
      AuthValidations.validateUserEmployeeNumberExist(userData.EmployeeNumber, existingUser);
    }

    try {
      const hashedPassword = await AuthValidations.hashPassword(password);
      const createdUser = await this.userService.createUserService({
        ...userData,
        password: hashedPassword,
        isReceptionist: true,
        isManager: false,
      });

      return ResponseUserDto.toDTO(createdUser);
    } catch (error) {
      AuthValidations.handleSignupError(error);
    }
  }

  private generateAuthResponse(user: IUserAuthResponse): AuthResponse {
    const payload = {
      sub: user.id,
      EmployeeNumber: user.EmployeeNumber,
      username: user.username,
      isReceptionist: user.isReceptionist,
      isManager: user.isManager,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        EmployeeNumber: user.EmployeeNumber,
        username: user.username,
        isReceptionist: user.isReceptionist,
        isManager: user.isManager,
      },
    };
  }

  private async findUserByEmployeeNumber(EmployeeNumber: number): Promise<IUserAuthResponse & { password?: string }> {
    const user = await this.userService.findByEmployeeNumber(EmployeeNumber);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user as IUserAuthResponse & { password?: string };
  }
}
