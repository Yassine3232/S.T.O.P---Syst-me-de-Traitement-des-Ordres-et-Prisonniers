import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";

@Entity()
export class User{
    id : number

    @Column()
    email : string

    @Column()
    Password : string
}