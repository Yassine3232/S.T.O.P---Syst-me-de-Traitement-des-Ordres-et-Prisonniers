import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cellule } from './cellule.entity';
import { CreateCelluleDto } from './dtos/create-cellule.dto';

@Injectable()
export class CellulesService {
  constructor(
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>
  ) {}

  async create(donnees: CreateCelluleDto) {
    const cellule = await this.findByName(donnees.nom);

    if (cellule !== null) {
      throw new BadRequestException('Cellule existe.');
    }

    const nouveauCellule = this.repoCellules.create({ nom: donnees.nom });
    return this.repoCellules.save(nouveauCellule);
  }

  async findById(id: number) {
    if (!id) {
       throw new NotFoundException('Cellule avec l\'id ' + id + ' est introuvable');
    }

    return await this.repoCellules.findOne({ where: { numeroIdentification: id } });
  }

  async findByName(nom: string) {
    if (!nom) {
      return null;
    }

    return await this.repoCellules.findOne({ where: { nom: nom } });
  }

  async findByNameWithPrisonnier(nom: string) {
    if (!nom) {
      return null;
    }

    return await this.repoCellules.findOne({ 
      where: { nom: nom }, 
      relations: ['prisonniers'] 
    });
  }

  findAll() {
    return this.repoCellules.find({ relations: ['prisonniers'] });
  }

  async update(id: number, attrs: Partial<Cellule>) {
    try {
      const cellule = await this.findById(id);
      if (cellule === null) {
        throw new Error('Cellule not found');
      }
      
      if (attrs.nom !== undefined) cellule.nom = attrs.nom;
      
      return this.repoCellules.save(cellule);
    }
    catch (err) {
      throw new NotFoundException('Cellule avec l\'id ' + id + ' est introuvable. Impossible de le modifier.');
    }
  }
}
