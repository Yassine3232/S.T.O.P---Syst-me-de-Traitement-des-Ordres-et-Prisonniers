import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService{
    getHello(): string {
        throw new Error('Method not implemented.');
    }
    constructor( @InjectRepository(User) private repo : Repository<User>){

}
}