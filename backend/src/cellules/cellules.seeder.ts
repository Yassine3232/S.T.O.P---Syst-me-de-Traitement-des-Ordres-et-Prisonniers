import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cellule } from './cellule.entity';

@Injectable()
export class CellulesSeeder {
  constructor(
    @InjectRepository(Cellule)
    private repoCellules: Repository<Cellule>,
  ) {}

  async seed() {
    for (let i = 1; i <= 10; i++) {
      const nom = `A${i}`;

      // Vérifie si la cellule existe déjà pour éviter les doublons
      const existe = await this.repoCellules.findOneBy({ nom });
      if (!existe) {
        const cellule = this.repoCellules.create({ nom });
        await this.repoCellules.save(cellule);
        console.log(`Cellule ${nom} créée`);
      }
    }
  }
}