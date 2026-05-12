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
<<<<<<< HEAD
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>,
=======
    @InjectRepository(Prisonnier)
    private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule)
    private repoCellules: Repository<Cellule>,
    private historiqueService: HistoriqueService,
>>>>>>> main
  ) {}

  async create(donnees: CreatePrisonnierDto) {
    const cellule = await this.repoCellules.findOne({ where: { nom: donnees.celluleNom } });
    if (cellule === null) {
      throw new NotFoundException('Cellule "' + donnees.celluleNom + '" introuvable');
    }

<<<<<<< HEAD
    const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any });
    if (nbPrisonniers >= 2) {
      throw new Error('La cellule ' + donnees.celluleNom + ' est pleine (limite de 2).');
    }

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
    return this.repoPrisonniers.save(nouveauPrisonnier);
=======
    const nouveauPrisonnier = this.repoPrisonniers.create({ ...donnees, cellule });
    const sauvegarde = await this.repoPrisonniers.save(nouveauPrisonnier);

    await this.historiqueService.enregistrer(
      sauvegarde,
      'creation',
      `Dossier créé — Cellule: ${cellule.nom}`,
    );

    return sauvegarde;
>>>>>>> main
  }

  async findById(id: number) {
    if (!id) {
      return null;
    }
    return await this.repoPrisonniers.findOne({ where: { numeroIdentification: id }, relations: ['cellule'] });
  }

  async findAll() {
    return this.repoPrisonniers.find({ relations: ['cellule'] });
  }

  async update(id: number, attrs: Partial<Prisonnier> & { celluleNom?: string }) {
    const prisonnier = await this.findById(id);
<<<<<<< HEAD
    if (prisonnier === null) {
      throw new Error('prisonnier not found');
    }
    
    if (attrs.nom !== undefined) prisonnier.nom = attrs.nom;
    if (attrs.prenom !== undefined) prisonnier.prenom = attrs.prenom;
    if (attrs.dateNaissance !== undefined) prisonnier.dateNaissance = attrs.dateNaissance;
    if (attrs.accusation !== undefined) prisonnier.accusation = attrs.accusation;
    if (attrs.dureePeine !== undefined) prisonnier.dureePeine = attrs.dureePeine;
    if (attrs.dateArrivee !== undefined) prisonnier.dateArrivee = attrs.dateArrivee;
    if (attrs.dateSortiePrevue !== undefined) prisonnier.dateSortiePrevue = attrs.dateSortiePrevue;

    // Handle cellule updates properly
    const anyAttrs: any = attrs;
    if (anyAttrs.celluleNom !== undefined) {
      const cellule = await this.repoCellules.findOne({ where: { nom: anyAttrs.celluleNom } });
      if (cellule !== null) {
        if (prisonnier.cellule?.numeroIdentification !== cellule.numeroIdentification) {
          const nbPrisonniers = await this.repoPrisonniers.count({ where: { cellule: { numeroIdentification: cellule.numeroIdentification } } as any });
          if (nbPrisonniers >= 2) {
            throw new Error('La cellule ' + anyAttrs.celluleNom + ' est pleine (limite de 2).');
          }
        }
        prisonnier.cellule = cellule;
      }
    }

    return this.repoPrisonniers.save(prisonnier);
=======
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
>>>>>>> main
  }
}