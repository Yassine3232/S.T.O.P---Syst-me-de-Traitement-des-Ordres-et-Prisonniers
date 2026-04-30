import { Injectable } from '@nestjs/common';
import { PrisonniersService } from './prisonniers.service';

@Injectable()
export class PrisonniersSeeder {
  constructor(private prisonniersService: PrisonniersService) {}

  async seed() {
    const prisonniers = [
      {
        nom: 'Tremblay',
        prenom: 'Michel',
        dateNaissance: '1985-03-12',
        accusation: 'Vol à main armée',
        dureePeine: 8,
        dateArrivee: '2020-06-15',
        dateSortiePrevue: '2028-06-15',
        photoProfil: '',
        celluleNom: 'A1',
      },
      {
        nom: 'Gagnon',
        prenom: 'Luc',
        dateNaissance: '1990-07-22',
        accusation: 'Fraude',
        dureePeine: 4,
        dateArrivee: '2022-01-10',
        dateSortiePrevue: '2026-01-10',
        photoProfil: '',
        celluleNom: 'A2',
      },
      {
        nom: 'Lavoie',
        prenom: 'Simon',
        dateNaissance: '1978-11-05',
        accusation: 'Trafic de drogue',
        dureePeine: 12,
        dateArrivee: '2019-03-20',
        dateSortiePrevue: '2031-03-20',
        photoProfil: '',
        celluleNom: 'A3',
      },
    ];

    for (const donnees of prisonniers) {
      try {
        await this.prisonniersService.create(donnees);
        console.log(`Prisonnier "${donnees.prenom} ${donnees.nom}" créé`);
      } catch (e) {
        console.log(`Prisonnier "${donnees.prenom} ${donnees.nom}" existe déjà, ignoré`);
      }
    }
  }
}