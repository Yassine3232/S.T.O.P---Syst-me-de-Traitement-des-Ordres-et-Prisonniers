import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Profile } from '../users/enum/profile.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.get<Profile[]>('roles', context.getHandler());

    if (!rolesRequis) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user || !rolesRequis.includes(user.profile)) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    return true;
  }
}