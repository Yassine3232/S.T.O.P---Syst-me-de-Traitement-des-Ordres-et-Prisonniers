import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Historique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeEvenement: string;

  @Column('text')
  description: string;

  @Column()
  date: string;

  @ManyToOne(() => Prisonnier)
  @JoinColumn()
  prisonnier: Prisonnier;
}