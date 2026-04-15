import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCelluleDto {
  @IsString()
  nom: string;

}
