import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cellule } from './cellule.entity';
import { CreateCelluleDto } from './dtos/create-cellule.dto';
import { Prisonnier } from 'src/prisonniers/prisonnier.entity';

@Injectable()
export class CellulesService {
  constructor(
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>
  ) {}

  create(donnees: CreateCelluleDto) {
    const nouveauCellule = this.repoCellules.create(donnees);
    return this.repoCellules.save(nouveauCellule);
  }

  async findById(id: number) {
    if (!id) return null;
    return await this.repoCellules.findOneBy({ numeroIdentification: id });
  }

  async findByName(nom: string) {
    if (!nom) return null;

    return await this.repoCellules.findOneBy({ nom: nom });
  }

    async findByNameWithPrisonnier(nom: string) {
    if (!nom) return null;

    return await this.repoCellules.findOne({ 
      where: { nom }, 
      relations: { prisonniers: true } 
    });
  }

  findAll() {
    return this.repoCellules.find();
  }

  async update(id: number, attrs: Partial<Cellule>) {
    const Cellule = await this.findById(id);
    if (!Cellule) throw new Error('Cellule not found');
    Object.assign(Cellule, attrs);
    return this.repoCellules.save(Cellule);
  }
}
