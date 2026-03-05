import { ExecutionContext, Injectable , CanActivate, UseInterceptors, UseGuards} from "@nestjs/common";

import { UserService } from "src/users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;

    if (!userId) {
      return false; 
    }

    const user = await this.userService.findById(userId);

    return !!user?.admin;
  }
}