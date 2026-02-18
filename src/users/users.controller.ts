import { Body, Controller, Post} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
    
    constructor(private service: UserService){}

    @Post()
    createUser(@Body() body : CreateUserDto){
        console.log(body)
    }
}
