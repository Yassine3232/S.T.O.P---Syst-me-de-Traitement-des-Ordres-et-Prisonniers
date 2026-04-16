import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { VisitesService } from './visites.service';
import { CreerDemandeVisiteDto } from './dtos/creer-demande-visite.dto';
import { RepondreDemandeVisiteDto } from './dtos/repondre-demande-visite.dto';
import { Profile } from 'src/users/enum/profile.enum';
import { Roles } from 'src/users/decorators/permission-user.decorator';
import { RolesGuard } from 'src/guards/roles-guards';

@Controller('visites')
export class VisitesController {
  constructor(private visitesService: VisitesService) {}

  @Post()
  soumettreDemandeVisite(@Body() body: CreerDemandeVisiteDto) {
    return this.visitesService.soumettreDemandeVisite(body);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Get()
  listerToutesLesVisites() {
    return this.visitesService.listerToutesLesVisites();
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Get('/en-attente')
  listerDemandesEnAttente() {
    return this.visitesService.listerDemandesEnAttente();
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Get('/dossier/:prisonnierId')
  consulterDossier(@Param('prisonnierId', ParseIntPipe) prisonnierId: number) {
    return this.visitesService.consulterDossierPrisonnier(prisonnierId);
  }

  @UseGuards(RolesGuard)
  @Roles(Profile.Directeur)
  @Patch('/:id/repondre')
  repondreDemandeVisite(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RepondreDemandeVisiteDto,
  ) {
    return this.visitesService.repondreDemandeVisite(id, body);
  }
}
