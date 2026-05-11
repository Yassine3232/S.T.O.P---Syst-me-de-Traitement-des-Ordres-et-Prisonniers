import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';
import { Cellule } from 'src/cellules/cellule.entity';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';
import { HistoriqueService } from '../historique/historique.service';

@Injectable()
export class PrisonniersService {
  constructor(
    @InjectRepository(Prisonnier)
    private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule)
    private repoCellules: Repository<Cellule>,
    private historiqueService: HistoriqueService,
  ) {}

  async create(donnees: CreatePrisonnierDto) {
    const cellule = await this.repoCellules.findOneBy({ nom: donnees.celluleNom });
    if (!cellule) throw new NotFoundException(`Cellule "${donnees.celluleNom}" introuvable`);

    const nouveauPrisonnier = this.repoPrisonniers.create({ ...donnees, cellule });
    const sauvegarde = await this.repoPrisonniers.save(nouveauPrisonnier);

    await this.historiqueService.enregistrer(
      sauvegarde,
      'creation',
      `Dossier créé — Cellule: ${cellule.nom}`,
    );

    return sauvegarde;
  }

  async findById(id: number) {
    if (!id) return null;
    return await this.repoPrisonniers.findOneBy({ numeroIdentification: id });
  }

  findAll() {
    return this.repoPrisonniers.find();
  }

  async update(id: number, attrs: Partial<Prisonnier> & { celluleNom?: string }) {
    const prisonnier = await this.findById(id);
    if (!prisonnier) throw new NotFoundException('Prisonnier introuvable');

    const modifications: string[] = [];

    if (attrs.celluleNom) {
      const cellule = await this.repoCellules.findOneBy({ nom: attrs.celluleNom });
      if (!cellule) throw new NotFoundException(`Cellule "${attrs.celluleNom}" introuvable`);
      (attrs as any).cellule = cellule;
      modifications.push(`Cellule changée: ${attrs.celluleNom}`);
      delete attrs.celluleNom;
    }

    const champs = ['nom', 'prenom', 'accusation', 'dureePeine', 'dateSortiePrevue'] as const;
    for (const champ of champs) {
      if (attrs[champ] !== undefined && attrs[champ] !== (prisonnier as any)[champ]) {
        modifications.push(`${champ}: ${(prisonnier as any)[champ]} → ${attrs[champ]}`);
      }
    }

    Object.assign(prisonnier, attrs);
    const sauvegarde = await this.repoPrisonniers.save(prisonnier);

    if (modifications.length > 0) {
      await this.historiqueService.enregistrer(
        sauvegarde,
        'modification',
        modifications.join(', '),
      );
    }

    return sauvegarde;
  }
}