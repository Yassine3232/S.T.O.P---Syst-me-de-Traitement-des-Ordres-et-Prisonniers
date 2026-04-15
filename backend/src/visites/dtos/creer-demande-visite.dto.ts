import { IsNumber, IsString } from 'class-validator';

export class CreerDemandeVisiteDto {
  @IsNumber()
  prisonnierId: number;

  @IsString()
  nomMembreFamille: string;

  @IsString()
  lienFamilial: string;
}
