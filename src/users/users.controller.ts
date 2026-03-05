import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AllowedLoggedIn, AuthGuard } from 'src/guards/auth-guards';

@Controller('auth')
//@UseInterceptors(CurrentUserInterceptor)
export class UserController {
    constructor(private service: UserService, private authservice: AuthService) { }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authservice.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }
    @AllowedLoggedIn()
    @Get("/message")
    async getMessage() {
        return 'TEST GETMESSAGE() METHOD AS NOT LOGGED IN'
    }
    @AllowedLoggedIn()
    @Get("/messageAdmin")
    async getMessageAsAdmin() {
        return 'TEST GETMESSAGE() METHOD AS ADMIN'
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authservice.signin(body.email, body.password)
        session.userId = user.id;
        console.log("Utilisateur connecté")
        return user;
    }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
        console.log("Utilisateur déconnecté")
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

    @Serialize(UserDto)
    @Get(':id') // Route : GET /users/1
    async getUserById(@Param('id', ParseIntPipe) id: number) {
        const user = await this.service.findById(id);
        if (!user) {
            throw new NotFoundException(`Aucun utilisateur trouvé avec l'email : ${id}`);
        }
        return user;
    }

    @Patch('find/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        return this.service.updateUser(id, body);
    }
}