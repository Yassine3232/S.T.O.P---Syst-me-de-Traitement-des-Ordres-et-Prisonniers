import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Session, UseInterceptors} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';

@Controller('auth')
export class UserController {
    constructor(private service: UserService, private authservice : AuthService){}

    @Post('/signup')
    async createUser(@Body() body : CreateUserDto, @Session() session : any){
        const user = await this.authservice.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body : CreateUserDto, @Session() session : any){
        const user  = await this.authservice.signin(body.email,body.password)
        session.userId = user.id;
        return user;
    }

    @Get('/whoami')
    whoAmI(@Session() session : any){
        const user = this.service.findById(session.userId)
        return user;
    }

    @Post('/signout')
    signOut(@Session() session : any){
        session.userId = null;
    }

    @Get()
    async getAllUsers() {
        return await this.service.findAll();
    }

    @Get('/email/:email') 
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.service.findByEmail(email); // Appel de ta méthode existante
        if (!user) {
            throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${email}`);
        }
        return user;
    }

    //@UseInterceptors(ClassSerializerInterceptor)
    @Serialize(UserDto)
    @Get(':id') // Route : GET /users/1
        async getUserById(@Param('id', ParseIntPipe) id: number) {
            const user = await this.service.findById(id);
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