import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HistoriqueService } from './historique.service';
import { RolesGuard } from '../guards/roles-guards';
import { Roles } from '../users/decorators/permission-user.decorator';
import { Profile } from '../users/enum/profile.enum';

@Controller('historique')
export class HistoriqueController {
  constructor(private historiqueService: HistoriqueService) {}

  @UseGuards(RolesGuard)
  @Roles(Profile.Garde, Profile.Directeur)
  @Get('/:prisonnierId')
  consulterHistorique(@Param('prisonnierId', ParseIntPipe) prisonnierId: number) {
    return this.historiqueService.trouverParPrisonnier(prisonnierId);
  }
}