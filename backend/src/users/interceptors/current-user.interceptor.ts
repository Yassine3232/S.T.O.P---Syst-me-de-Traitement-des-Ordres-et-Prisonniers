import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { UserService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService: UserService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        const request = context.switchToHttp().getRequest();
        const userId = request.session.userId;

        if(userId){
            const user = await this.userService.findById(userId);
            request.currentUser = user;
        }
        return next.handle();
    }
    
}