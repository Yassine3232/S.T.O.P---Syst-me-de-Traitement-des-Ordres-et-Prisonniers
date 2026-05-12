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
      {
        nom: 'Côté',
        prenom: 'Martin',
        dateNaissance: '1995-10-30',
        accusation: 'Vandalisme',
        dureePeine: 2,
        dateArrivee: '2023-05-11',
        dateSortiePrevue: '2025-05-11',
        photoProfil: '',
        celluleNom: 'A1',
      },
      {
        nom: 'Bélanger',
        prenom: 'Éric',
        dateNaissance: '1982-12-14',
        accusation: 'Recel',
        dureePeine: 5,
        dateArrivee: '2021-08-05',
        dateSortiePrevue: '2026-08-05',
        photoProfil: '',
        celluleNom: 'A4',
      },
      {
        nom: 'Pelletier',
        prenom: 'François',
        dateNaissance: '1975-04-18',
        accusation: 'Voies de fait',
        dureePeine: 7,
        dateArrivee: '2018-09-22',
        dateSortiePrevue: '2025-09-22',
        photoProfil: '',
        celluleNom: 'A5',
      },
    ];

    try {
      const res = await fetch('https://randomuser.me/api/?results=10');
      const data = await res.json();
      const results = data.results;
      
      const accusations = ['Vol à main armée', 'Fraude', 'Agression', 'Trafic de drogue', 'Meurtre', 'Cybercriminalité', 'Vandalisme', 'Recel'];
      const cellulesPossibles = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'];
      
      for (let k = 0; k < results.length; k++) {
        const r = results[k];
        
        const idxAcc = Math.floor(Math.random() * accusations.length);
        const accusation = accusations[idxAcc];
        
        const idxCel = Math.floor(Math.random() * cellulesPossibles.length);
        const celluleNom = cellulesPossibles[idxCel];
        
        const dureePeine = Math.floor(Math.random() * 20) + 1;
        
        let dateNaissance = '';
        if (r.dob && r.dob.date) {
          dateNaissance = r.dob.date.split('T')[0];
        } else {
          dateNaissance = '1990-01-01';
        }
        
        let dateArrivee = '';
        if (r.registered && r.registered.date) {
          dateArrivee = r.registered.date.split('T')[0];
        } else {
          dateArrivee = '2023-01-01';
        }
        
        let anneeArrivee = parseInt(dateArrivee.split('-')[0]);
        const dateSortiePrevue = (anneeArrivee + dureePeine) + '-01-01';

        prisonniers.push({
          nom: r.name.last,
          prenom: r.name.first,
          dateNaissance: dateNaissance,
          accusation: accusation,
          dureePeine: dureePeine,
          dateArrivee: dateArrivee,
          dateSortiePrevue: dateSortiePrevue,
          photoProfil: r.picture.large,
          celluleNom: celluleNom,
        });
      }
    } catch (e) {
      console.log("Erreur lors de l'appel a randomuser.me");
    }

    for (let i = 0; i < prisonniers.length; i++) {
      const donnees = prisonniers[i];
      try {
        const existants = await this.prisonniersService.findAll();
        let dejaPresent = false;
        
        for (let j = 0; j < existants.length; j++) {
          if (existants[j].nom === donnees.nom && existants[j].prenom === donnees.prenom) {
            dejaPresent = true;
          }
        }
        
        if (dejaPresent === false) {
          let cree = false;
          let tentatives = 0;
          const cellulesPossibles = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'];
          
          while (cree === false && tentatives <= cellulesPossibles.length) {
            try {
              await this.prisonniersService.create(donnees);
              console.log('Prisonnier "' + donnees.prenom + ' ' + donnees.nom + '" créé dans ' + donnees.celluleNom);
              cree = true;
            } catch (e: any) {
              if (e.message && e.message.includes('pleine')) {
                if (tentatives < cellulesPossibles.length) {
                  donnees.celluleNom = cellulesPossibles[tentatives];
                  tentatives++;
                } else {
                  console.log('Toutes les cellules sont pleines !');
                  break;
                }
              } else {
                console.log('Erreur lors de la création du prisonnier "' + donnees.prenom + ' ' + donnees.nom + '"');
                break;
              }
            }
          }
        } else {
          let prisonnierId = 0;
          for (let j = 0; j < existants.length; j++) {
            if (existants[j].nom === donnees.nom && existants[j].prenom === donnees.prenom) {
              prisonnierId = existants[j].numeroIdentification;
            }
          }
          
          let misAJour = false;
          let tentatives = 0;
          const cellulesPossibles = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'];
          
          while (misAJour === false && tentatives <= cellulesPossibles.length) {
            try {
              await this.prisonniersService.update(prisonnierId, { celluleNom: donnees.celluleNom } as any);
              console.log('Prisonnier "' + donnees.prenom + ' ' + donnees.nom + '" existe déjà, cellule mise à jour (' + donnees.celluleNom + ')');
              misAJour = true;
            } catch (e: any) {
              if (e.message && e.message.includes('pleine')) {
                if (tentatives < cellulesPossibles.length) {
                  donnees.celluleNom = cellulesPossibles[tentatives];
                  tentatives++;
                } else {
                  console.log('Toutes les cellules sont pleines !');
                  break;
                }
              } else {
                console.log('Erreur lors de la mise à jour du prisonnier "' + donnees.prenom + ' ' + donnees.nom + '"');
                break;
              }
            }
          }
        }
      } catch (e) {
        console.log('Erreur fatale lors du traitement de ' + donnees.prenom + ' ' + donnees.nom);
      }
    }
  }
}