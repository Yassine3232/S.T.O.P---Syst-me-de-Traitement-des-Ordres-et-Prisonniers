import {  Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "src/users/users.service";

@Injectable()
export class CurrentUserMiddleWare implements NestMiddleware{
    constructor(private useService : UserService){}

    async use(req:any,res:any,next:(error?:any) => void){
        const {userId} = req.session

        if(userId){
            const user=await this.useService.findById(userId)
            req.session.CurrentUser = user;
        }

        next()
    }
}