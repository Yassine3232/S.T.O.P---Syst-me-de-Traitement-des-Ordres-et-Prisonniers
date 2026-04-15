import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './enum/profile.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  profile: Profile;

  @Column()
  dateNaissance: string;
}