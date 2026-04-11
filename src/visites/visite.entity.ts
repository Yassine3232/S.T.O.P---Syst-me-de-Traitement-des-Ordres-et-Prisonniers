import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Visite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nomMembreFamille: string;

  @Column()
  lienFamilial: string;

  @Column({ default: 'en_attente' })
  statut: string;

  @Column({ nullable: true })
  dateVisite: string;

  @Column({ nullable: true })
  motifRefus: string;

  @ManyToOne(() => Prisonnier)
  @JoinColumn()
  prisonnier: Prisonnier;
}
