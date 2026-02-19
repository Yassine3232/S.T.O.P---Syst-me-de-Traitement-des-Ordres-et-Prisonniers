import { Body, Controller, Param, Patch, Post} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UserController {
    
    constructor(private service: UserService){}

    @Post('/signup')
    createUser(@Body() body : CreateUserDto){
        //console.log(body)
        return this.service.create(body.email, body.password);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.service.updateUser(parseInt(id), body);
    }
}
