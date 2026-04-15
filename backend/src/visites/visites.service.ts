import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visite } from './visite.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { Incident } from '../incidents/incident.entity';
import { CreerDemandeVisiteDto } from './dtos/creer-demande-visite.dto';
import { RepondreDemandeVisiteDto } from './dtos/repondre-demande-visite.dto';

@Injectable()
export class VisitesService {
  constructor(
    @InjectRepository(Visite) private repoVisite: Repository<Visite>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
  ) {}

  async soumettreDemandeVisite(donnees: CreerDemandeVisiteDto) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: donnees.prisonnierId } });

    if (!prisonnier) {
      throw new NotFoundException('Prisonnier introuvable');
    }

    const nouvelleVisite = this.repoVisite.create({
      nomMembreFamille: donnees.nomMembreFamille,
      lienFamilial: donnees.lienFamilial,
      statut: 'en_attente',
      prisonnier,
    });

    return this.repoVisite.save(nouvelleVisite);
  }

  async consulterDossierPrisonnier(prisonnierId: number) {
    const prisonnier = await this.repoPrisonnier.findOne({ where: { numeroIdentification: prisonnierId } });

    if (!prisonnier) {
      throw new NotFoundException('Prisonnier introuvable');
    }

    const incidentsLies = await this.repoIncident
      .createQueryBuilder('incident')
      .innerJoin('incident.prisonniers', 'prisonnier')
      .where('prisonnier.numeroIdentification = :id', { id: prisonnierId })
      .getMany();

    const visitesPrecedentes = await this.repoVisite.find({ where: { prisonnier: { numeroIdentification: prisonnierId } as any } });

    return {
      prisonnier,
      incidents: incidentsLies,
      visitesPrecedentes,
    };
  }

  async repondreDemandeVisite(visiteId: number, donnees: RepondreDemandeVisiteDto) {
    const visite = await this.repoVisite.findOne({ where: { id: visiteId }, relations: ['prisonnier'] });

    if (!visite) {
      throw new NotFoundException('Demande de visite introuvable');
    }

    if (visite.statut !== 'en_attente') {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    if (donnees.decision === 'approuvee') {
      visite.statut = 'approuvee';
      visite.dateVisite = donnees.dateVisite;
    } else if (donnees.decision === 'refusee') {
      visite.statut = 'refusee';
      visite.motifRefus = donnees.motifRefus;
    } else {
      throw new BadRequestException('La décision doit être approuvee ou refusee');
    }

    return this.repoVisite.save(visite);
  }

  async listerDemandesEnAttente() {
    return this.repoVisite.find({ where: { statut: 'en_attente' }, relations: ['prisonnier'] });
  }

  async listerToutesLesVisites() {
    return this.repoVisite.find({ relations: ['prisonnier'] });
  }
}
