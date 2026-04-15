import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Prisonnier } from '../prisonniers/prisonnier.entity';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  dateHeure: string;

  @Column()
  rapportePar: string;

  @ManyToMany(() => Prisonnier)
  @JoinTable()
  prisonniers: Prisonnier[];
}
