import { Prisonnier } from 'src/prisonniers/prisonnier.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cellule {
  @PrimaryGeneratedColumn()
  numeroIdentification: number;

  @Column()
  nom: string;

  @OneToMany(() => Prisonnier, (prisonnier) => prisonnier.cellule)
  prisonniers!: Prisonnier[];
}
