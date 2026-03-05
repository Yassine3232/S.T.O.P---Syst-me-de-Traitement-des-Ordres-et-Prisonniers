import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Session,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth/auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AllowedLoggedIn } from '../guards/auth-guards';

@Controller('auth')
export class UserController {
  constructor(
    private service: UserService,
    private authservice: AuthService,
  ) {}


  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authservice.signup(body.email, body.password, body.admin);
    
    session.userId = user.id;
    session.CurrentUser = user; 
    
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authservice.signin(body.email, body.password);
    
    session.userId = user.id;
    session.CurrentUser = user;
    
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
    session.CurrentUser = null;
  }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }


  @AllowedLoggedIn()
  @Get('/messageAdmin')
  async getMessageAsAdmin() {
    return 'SUCCESS: You are an Admin';
  }

  @Get('/message')
  async getMessage() {
    return 'TEST: This route is public or uses a different logic';
  }


  @Get()
  findAllUsers() {
    return this.service.findAll();
  }

  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.service.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`No user found with email: ${email}`);
    }
    return user;
  }

  @Serialize(UserDto)
  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findById(id);
    if (!user) {
      throw new NotFoundException(`No user found with id: ${id}`);
    }
    return user;
  }

  @Patch('/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return await this.service.update(id, body);
  }
}