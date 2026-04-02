import { IsEmail, IsString, IsBoolean, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Profile } from '../enum/profile.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(Profile)
  profile: Profile;

  @IsDateString()
  dateNaissance: string;
}