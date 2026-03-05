import { ExecutionContext, Injectable , CanActivate, UseInterceptors, UseGuards} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext):boolean | Promise<boolean> | Observable<boolean>{
        return context.switchToHttp().getRequest().session.userId != null 
    }
}
export function AllowedLoggedIn(){
    return UseGuards(AuthGuard)
}