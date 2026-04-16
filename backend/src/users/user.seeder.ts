import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { Profile } from './enum/profile.enum';

@Injectable()
export class UsersSeeder {
  constructor(
    private authService: AuthService,
  ) {}

  async seed() {
    const usersParDefaut = [
      {
        email: 'adamroy7428@gmail.com',
        password: '123',
        name: 'Adam',
        profile: Profile.Garde,
        dateNaissance: '2005-07-15',
      },
      {
        email: 'royst@videotron.ca',
        password: '123',
        name: 'Stéphane',
        profile: Profile.Directeur,
        dateNaissance: '1966-07-24',
      },
    ];

    for (const donnees of usersParDefaut) {
      try {
        await this.authService.signup(
          donnees.email,
          donnees.password,
          donnees.name,
          donnees.profile,
          donnees.dateNaissance,
        );
        console.log(`Utilisateur "${donnees.name}" créé`);
      } catch (e) {
        console.log(`User "${donnees.name}" est déjà présent dans la base de données`);
      }
    }
  }
}