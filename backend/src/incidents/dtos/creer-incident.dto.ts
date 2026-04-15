import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class CreerIncidentDto {
  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsString()
  dateHeure: string;

  @IsString()
  rapportePar: string;

  @IsArray()
  @ArrayNotEmpty()
  prisonniersIds: number[];
}
