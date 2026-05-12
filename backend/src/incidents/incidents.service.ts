import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Incident } from './incident.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { CreerIncidentDto } from './dtos/creer-incident.dto';
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private repoIncident: Repository<Incident>,
    @InjectRepository(Prisonnier) private repoPrisonnier: Repository<Prisonnier>,
    private historiqueService: HistoriqueService,
  ) {}

  async creerIncident(donnees: CreerIncidentDto) {
    const prisonniersTrouves = await this.repoPrisonnier.findBy({ numeroIdentification: In(donnees.prisonniersIds) });

    if (prisonniersTrouves.length === 0) {
      throw new NotFoundException('Aucun prisonnier trouvé avec ces identifiants');
    }

    const nouvelIncident = this.repoIncident.create({
      type: donnees.type,
      description: donnees.description,
      dateHeure: donnees.dateHeure,
      rapportePar: donnees.rapportePar,
      prisonniers: prisonniersTrouves,
    });

    const sauvegarde = await this.repoIncident.save(nouvelIncident);

    for (const prisonnier of prisonniersTrouves) {
      await this.historiqueService.enregistrer(
        prisonnier,
        'incident',
        `Incident "${donnees.type}" — ${donnees.description} — Rapporté par: ${donnees.rapportePar}`,
      );
    }

    return sauvegarde;
  }

  async trouverTous() {
    return this.repoIncident.find({ relations: ['prisonniers'] });
  }

  async trouverParId(id: number) {
    const incident = await this.repoIncident.findOne({ where: { id }, relations: ['prisonniers'] });
    if (!incident) {
      throw new NotFoundException('Incident introuvable');
    }
    return incident;
  }
}