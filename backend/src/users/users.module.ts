import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthService } from './auth/auth.service';
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { UsersSeeder } from "./user.seeder";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [
      UserService, 
      AuthService,
      UsersSeeder,
      {
        provide: APP_INTERCEPTOR,
        useClass: CurrentUserInterceptor
      }
    ],
    exports: [TypeOrmModule, UsersSeeder, AuthService],
  })
  
  export class UserModule {}