import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../users/users.service';
import { Profile } from '../users/enum/profile.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesRequis = this.reflector.get<Profile[]>('roles', context.getHandler());
    if (!rolesRequis) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request.session?.userId;

    if (!userId) throw new ForbiddenException('Accès refusé : rôle insuffisant');

    const user = await this.userService.findById(userId);

    if (!user || !rolesRequis.includes(user.profile)) {
      throw new ForbiddenException('Accès refusé : rôle insuffisant');
    }

    return true;
  }
}