import { IsString, IsOptional } from 'class-validator';

export class RepondreDemandeVisiteDto {
  @IsString()
  decision: string;

  @IsString()
  @IsOptional()
  dateVisite: string;

  @IsString()
  @IsOptional()
  motifRefus: string;
}
