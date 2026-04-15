import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePrisonnierDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsString()
  dateNaissance: string;

  @IsString()
  accusation: string;

  @IsNumber()
  dureePeine: number;

  @IsString()
  dateArrivee: string;

  @IsString()
  dateSortiePrevue: string;

  @IsOptional()
  @IsString()
  photoProfil: string;

  @IsString()
  celluleNom: string;
}
