import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthService } from './auth/auth.service';
import { CurrentUserInterceptor } from "./interceptors/urrent-user.interceptor";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, AuthService, CurrentUserInterceptor],
  })
  export class UserModule {}