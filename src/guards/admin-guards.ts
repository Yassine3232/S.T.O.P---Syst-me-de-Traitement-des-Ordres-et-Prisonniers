import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const user = request.session?.CurrentUser;

    if (!user) {
      console.log('Guard Blocked: No user in session');
      return false;
    }

    if (user.admin === true) {
      return true;
    }

    console.log(`Guard Blocked: User ${user.id} is not an admin`);
    return false;
  }
}