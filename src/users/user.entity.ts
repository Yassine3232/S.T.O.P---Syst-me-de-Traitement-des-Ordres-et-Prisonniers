import { Entity, PrimaryGeneratedColumn, Column, AfterInsert } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    email : string

    @Exclude()
    @Column()
    password : string

    @Column({default:true})
    admin:boolean;

    @AfterInsert()
    logInsert(){
        console.log(`User with id ${this.id} has been created`)
    }
}