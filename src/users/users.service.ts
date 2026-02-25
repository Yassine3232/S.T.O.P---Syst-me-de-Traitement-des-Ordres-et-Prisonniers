import { ClassSerializerInterceptor, Injectable, UseInterceptors } from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService{

    constructor( @InjectRepository(User) private repo : Repository<User>){}
    create(email : string, password : string){
        const user = this.repo.create({email : email, password : password})
        return this.repo.save(user)
    }

    async findAll(){
        return this.repo.find();
    }

    async findOne(email : string){
        return await this.repo.findOne({where : {email : email}});
    }


    async findById(id : number){
        return await this.repo.findOne({where : {id : id}});
    }

    async updateUser(id : number, attrs : Partial<User>){
        const user = await this.repo.findOneBy({id : id})
        if (!user){
            return null
        }

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

}