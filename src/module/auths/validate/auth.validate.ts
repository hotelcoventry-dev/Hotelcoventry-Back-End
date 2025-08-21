import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserAuthResponse } from '../interface/IAuth.interface';
import { Users } from 'src/module/users/Entyties/users.entity';
export class AuthValidations {
  private static readonly BCRYPT_ROUNDS = 12;

  static validateCredentials(EmployeeNumber: number, password: string): void {
    if (!EmployeeNumber || !password) {
      throw new BadRequestException('EmployeeNumber and password are required');
    }
  }

  static validatePasswordMatch(password: string, confirmPassword: string): void {
    if (!password || !confirmPassword) {
      throw new BadRequestException('You must provide both passwords');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  static async generateRandomPassword(): Promise<string> {
    const randomString = `${Math.random().toString(36).slice(-8)}Aa1!`;
    return await bcrypt.hash(randomString, this.BCRYPT_ROUNDS);
  }

  static handleSignupError(error: unknown): never {
    console.error('[AuthsService:signup] →', error);

    if (error && typeof error === 'object' && 'code' in error && (error as { code?: unknown }).code === '23505') {
      throw new BadRequestException('The email or username already exists');
    }

    throw new InternalServerErrorException('Error registering user');
  }

  static validateUserEmployeeNumberExist(EmployeeNumber: number, user: Users): void {
    if (user.EmployeeNumber == EmployeeNumber) {
      throw new ConflictException(`EmployeeNumber '${EmployeeNumber}' already exists`);
    }
  }

  static validateEmployeeNumberNotTaken(EmployeeNumber?: number | null): void {
    if (EmployeeNumber) {
      throw new UnauthorizedException('El EmployeeNumber ya está registrado');
    }
  }

  static validateUserHasPassword(
    user: IUserAuthResponse & { password?: string },
  ): asserts user is IUserAuthResponse & { password: string } {
    if (!user.password) {
      throw new UnauthorizedException('Invalids credentials');
    }
  }

  static async validatePassword(inputPassword: string, hashedPassword: string): Promise<void> {
    const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalids credentials');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }
}
