import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';
import { Cellule } from 'src/cellules/cellule.entity';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';

@Injectable()
export class PrisonniersService {
  constructor(
    @InjectRepository(Prisonnier)
    private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule)
    private repoCellules: Repository<Cellule>,
  ) {}

  async create(donnees: CreatePrisonnierDto) {
    const cellule = await this.repoCellules.findOneBy({ nom: donnees.celluleNom });
    if (!cellule) throw new NotFoundException(`Cellule "${donnees.celluleNom}" introuvable`);

    const nouveauPrisonnier = this.repoPrisonniers.create({...donnees,cellule,});
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
