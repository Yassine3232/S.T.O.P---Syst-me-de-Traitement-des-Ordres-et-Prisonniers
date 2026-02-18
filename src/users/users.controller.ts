import { Body, Controller, Post} from '@nestjs/common';
import { UserService } from './users.service';

@Controller()
export class UserController {
    
    constructor(private service: UserService){}

    @Post()
    createUser(@Body() body : any){
        console.log(body)
    }
}
