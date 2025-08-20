import { SetMetadata, CustomDecorator } from '@nestjs/common';

export enum UserRole {
  RECEPTIONIST = 'receptionist',
  MANAGER = 'manager',
}

export const Roles = (...roles: UserRole[]): CustomDecorator<string> => SetMetadata('roles', roles);
