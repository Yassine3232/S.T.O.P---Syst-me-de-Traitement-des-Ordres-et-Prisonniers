import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from "@nestjs/common";
import { UserService } from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor{
    constructor(private userService: UserService) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>){
        // Trouver l'id de l'utilisateur à partir de la session
        const request = context.switchToHttp().getRequest();
        const userId = request.session.userId;

        if(!userId){
            throw new NotFoundException("Pas d'utilisateur connecté")
        }


        // Trouver l'uti8lisateur dans la base de données en utilisant le userid
        const user = await this.userService.findById(userId);

        // Assigner l'utilisateur trouvé à une nouvelle propriété sur la requête
        request.currentUser = user;

        // Go pour request handler ou next interceptor
        return next.handle();
    }
    
}