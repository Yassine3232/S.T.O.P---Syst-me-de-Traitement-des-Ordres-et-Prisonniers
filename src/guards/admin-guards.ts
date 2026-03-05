import { ExecutionContext, Injectable , CanActivate, UseInterceptors, UseGuards} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    
    return request.currentUser && request.currentUser.admin;
  }
}
export function AllowedLoggedIn(){
    return UseGuards(AdminGuard)
}