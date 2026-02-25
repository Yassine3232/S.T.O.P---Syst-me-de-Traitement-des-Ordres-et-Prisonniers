import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseInterceptors} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('users')
export class UserController {
    
    constructor(private service: UserService){}

    @Post('/signup')
    createUser(@Body() body : CreateUserDto){
        //console.log(body)
        return this.service.create(body.email, body.password);
    }

    @Get()
    async getAllUsers() {
        return await this.service.findAll();
    }

    @Get('/email/:email') 
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.service.findOne(email); // Appel de ta méthode existante
        if (!user) {
            throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${email}`);
        }
        return user;
    }

    //@UseInterceptors(ClassSerializerInterceptor)
    @UseInterceptors(SerializeInterceptor)
    @Get(':id') // Route : GET /users/1
        async getUserById(@Param('id', ParseIntPipe) id: number) {
            const user = await this.service.findById(id);
            console.log("Handler is running")
            if (!user) {
            throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${id}`);
            }
            return user;
        }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.service.updateUser(parseInt(id), body);
    }
}
