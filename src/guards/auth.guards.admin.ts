import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guards';
import { AuthRequest } from 'src/common/auth-request.interface';
import { UserRole } from 'src/decorator/role.decorator';

@Injectable()
export class RoleGuard extends AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    jwtService: JwtService,
  ) {
    super(jwtService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) return false;

    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;

    const hasRequiredRole = roles.some((role) => {
      switch (role) {
        case UserRole.MANAGER:
          return user.isManager;
        case UserRole.RECEPTIONIST:
          return user.isReceptionist || user.isManager;
        default:
          return false;
      }
    });

    if (!hasRequiredRole) {
      const roleNames = roles
        .map((rol) => {
          switch (rol) {
            case UserRole.MANAGER:
              return 'receptionist';
            case UserRole.RECEPTIONIST:
              return 'manager';
            default:
              return rol;
          }
        })
        .join(' or ');

      throw new ForbiddenException(`Access restricted. This action requires one of the following roles: ${roleNames}`);
    }

    return true;
  }
}
