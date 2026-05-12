import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historique } from './historique.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Injectable()
export class HistoriqueService {
  constructor(
    @InjectRepository(Historique)
    private repoHistorique: Repository<Historique>,
  ) {}

  async enregistrer(prisonnier: Prisonnier, typeEvenement: string, description: string) {
    const entree = this.repoHistorique.create({
      prisonnier,
      typeEvenement,
      description,
      date: new Date().toISOString(),
    });
    return this.repoHistorique.save(entree);
  }

  async trouverParPrisonnier(prisonnierId: number) {
    return this.repoHistorique.find({
      where: { prisonnier: { numeroIdentification: prisonnierId } },
      order: { date: 'DESC' },
    });
  }
}