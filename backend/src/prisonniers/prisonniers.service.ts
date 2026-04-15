import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';

@Injectable()
export class PrisonniersService {
  constructor(
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>
  ) {}

  create(donnees: CreatePrisonnierDto) {
    const nouveauPrisonnier = this.repoPrisonniers.create(donnees);
    return this.repoPrisonniers.save(nouveauPrisonnier);
  }

  async findById(id: number) {
    if (!id) return null;
    return await this.repoPrisonniers.findOneBy({ numeroIdentification: id });
  }

  findAll() {
    return this.repoPrisonniers.find();
  }

  async update(id: number, attrs: Partial<Prisonnier>) {
    const prisonnier = await this.findById(id);
    if (!prisonnier) throw new Error('prisonnier not found');
    Object.assign(prisonnier, attrs);
    return this.repoPrisonniers.save(prisonnier);
  }
}
