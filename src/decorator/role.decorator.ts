import { SetMetadata, CustomDecorator } from '@nestjs/common';

export enum UserRole {
  CONSERGE = 'conserge',
  ENCARGADO = 'encargado',
}

export const Roles = (...roles: UserRole[]): CustomDecorator<string> => SetMetadata('roles', roles);
