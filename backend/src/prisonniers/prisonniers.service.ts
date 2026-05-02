import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prisonnier } from './prisonnier.entity';
import { Cellule } from 'src/cellules/cellule.entity';
import { CreatePrisonnierDto } from './dtos/create-prisonnier.dto';

@Injectable()
export class PrisonniersService {
  constructor(
    @InjectRepository(Prisonnier) private repoPrisonniers: Repository<Prisonnier>,
    @InjectRepository(Cellule) private repoCellules: Repository<Cellule>,
  ) {}

  async create(donnees: CreatePrisonnierDto) {
    const cellule = await this.repoCellules.findOne({ where: { nom: donnees.celluleNom } });
    if (cellule === null) {
      throw new NotFoundException('Cellule "' + donnees.celluleNom + '" introuvable');
    }

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

  async update(id: number, attrs: Partial<Prisonnier>) {
    const prisonnier = await this.findById(id);
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
  }
}
