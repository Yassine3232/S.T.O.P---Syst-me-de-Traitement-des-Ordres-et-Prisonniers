import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Prisonnier {
  @PrimaryGeneratedColumn()
  numeroIdentification: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  dateNaissance: string;

  @Column()
  accusation: string;

  @Column()
  dureePeine: number;

  @Column()
  dateArrivee: string;

  @Column()
  dateSortiePrevue: string;

  @Column({ type: 'text', nullable: true })
  photoProfil: string;
}
