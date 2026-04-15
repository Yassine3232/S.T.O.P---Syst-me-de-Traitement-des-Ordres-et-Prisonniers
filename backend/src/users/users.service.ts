import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Profile } from './enum/profile.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, name: string, profile: Profile, dateNaissance: string) {
    const user = this.repo.create({ email, password, name, profile, dateNaissance });
    return this.repo.save(user);
  }

  async findById(id: number) {
    if (!id) return null;
    return await this.repo.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.repo.findOneBy({ email });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return this.repo.remove(user);
  }
}