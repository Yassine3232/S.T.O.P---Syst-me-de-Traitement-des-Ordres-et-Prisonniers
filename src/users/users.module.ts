import { Module } from "@nestjs/common";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { AuthServiceTsService } from './auth.service.ts/auth.service.ts.service';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, AuthServiceTsService, AuthService],
  })
  export class UserModule {}