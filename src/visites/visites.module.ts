import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visite } from './visite.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { Incident } from '../incidents/incident.entity';
import { VisitesService } from './visites.service';
import { VisitesController } from './visites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visite, Prisonnier, Incident])],
  providers: [VisitesService],
  controllers: [VisitesController],
})
export class VisitesModule {}
