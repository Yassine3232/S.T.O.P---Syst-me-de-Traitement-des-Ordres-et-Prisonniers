import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Profile } from '../enum/profile.enum';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(Profile)
  profile: Profile;

  @IsDateString()
  dateNaissance: string;
}