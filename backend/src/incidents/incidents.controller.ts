import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreerIncidentDto } from './dtos/creer-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  @Post()
  creerIncident(@Body() body: CreerIncidentDto) {
    return this.incidentsService.creerIncident(body);
  }

  @Get()
  listerIncidents() {
    return this.incidentsService.trouverTous();
  }

  @Get('/:id')
  voirIncident(@Param('id', ParseIntPipe) id: number) {
    return this.incidentsService.trouverParId(id);
  }
}
