import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { VisitesService } from './visites.service';
import { CreerDemandeVisiteDto } from './dtos/creer-demande-visite.dto';
import { RepondreDemandeVisiteDto } from './dtos/repondre-demande-visite.dto';

@Controller('visites')
export class VisitesController {
  constructor(private visitesService: VisitesService) {}

  @Post()
  soumettreDemandeVisite(@Body() body: CreerDemandeVisiteDto) {
    return this.visitesService.soumettreDemandeVisite(body);
  }

  @Get()
  listerToutesLesVisites() {
    return this.visitesService.listerToutesLesVisites();
  }

  @Get('/en-attente')
  listerDemandesEnAttente() {
    return this.visitesService.listerDemandesEnAttente();
  }

  @Get('/dossier/:prisonnierId')
  consulterDossier(@Param('prisonnierId', ParseIntPipe) prisonnierId: number) {
    return this.visitesService.consulterDossierPrisonnier(prisonnierId);
  }

  @Patch('/:id/repondre')
  repondreDemandeVisite(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RepondreDemandeVisiteDto,
  ) {
    return this.visitesService.repondreDemandeVisite(id, body);
  }
}
