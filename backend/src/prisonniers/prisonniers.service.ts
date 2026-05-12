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
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>,
    private historiqueService: HistoriqueService,
  ) {}

  async create(donnees: CreatePrisonnierDto) {
    const cellule = await this.repoCellules.findOne({ where: { nom: donnees.celluleNom } });
    if (!cellule) throw new NotFoundException(`Cellule "${donnees.celluleNom}" introuvable`);

    const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any });
    if (nbPrisonniers >= 2) throw new Error('La cellule ' + donnees.celluleNom + ' est pleine (limite de 2).');

    const nouveauPrisonnier = this.repoPrisonniers.create({
      nom: donnees.nom,
      prenom: donnees.prenom,
      dateNaissance: donnees.dateNaissance,
      accusation: donnees.accusation,
      dureePeine: donnees.dureePeine,
      dateArrivee: donnees.dateArrivee,
      dateSortiePrevue: donnees.dateSortiePrevue,
      cellule: cellule,
    });

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
    return await this.repoPrisonniers.findOne({ where: { numeroIdentification: id }, relations: ['cellule'] });
  }

  async findAll() {
    return this.repoPrisonniers.find({ relations: ['cellule'] });
  }

  async update(id: number, attrs: Partial<Prisonnier> & { celluleNom?: string }) {
    const prisonnier = await this.findById(id);
    if (!prisonnier) throw new NotFoundException('Prisonnier introuvable');

    const modifications: string[] = [];

    if (attrs.nom !== undefined) { modifications.push(`Nom: ${prisonnier.nom} → ${attrs.nom}`); prisonnier.nom = attrs.nom; }
    if (attrs.prenom !== undefined) { modifications.push(`Prénom: ${prisonnier.prenom} → ${attrs.prenom}`); prisonnier.prenom = attrs.prenom; }
    if (attrs.dateNaissance !== undefined) { prisonnier.dateNaissance = attrs.dateNaissance; }
    if (attrs.accusation !== undefined) { modifications.push(`Accusation: ${prisonnier.accusation} → ${attrs.accusation}`); prisonnier.accusation = attrs.accusation; }
    if (attrs.dureePeine !== undefined) { modifications.push(`Durée peine: ${prisonnier.dureePeine} → ${attrs.dureePeine}`); prisonnier.dureePeine = attrs.dureePeine; }
    if (attrs.dateArrivee !== undefined) { prisonnier.dateArrivee = attrs.dateArrivee; }
    if (attrs.dateSortiePrevue !== undefined) { modifications.push(`Sortie prévue: ${prisonnier.dateSortiePrevue} → ${attrs.dateSortiePrevue}`); prisonnier.dateSortiePrevue = attrs.dateSortiePrevue; }

    const anyAttrs: any = attrs;
    if (anyAttrs.celluleNom !== undefined) {
      const cellule = await this.repoCellules.findOne({ where: { nom: anyAttrs.celluleNom } });
      if (cellule !== null) {
        if (prisonnier.cellule?.numeroIdentification !== cellule.numeroIdentification) {
          const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any });
          if (nbPrisonniers >= 2) throw new Error('La cellule ' + anyAttrs.celluleNom + ' est pleine (limite de 2).');
          modifications.push(`Cellule changée: ${prisonnier.cellule?.nom} → ${cellule.nom}`);
        }
        prisonnier.cellule = cellule;
      }
    }

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