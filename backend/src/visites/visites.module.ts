import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visite } from './visite.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { Incident } from '../incidents/incident.entity';
import { VisitesService } from './visites.service';
import { VisitesController } from './visites.controller';
import { RolesGuard } from '../guards/roles-guards';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visite, Prisonnier, Incident]), UserModule],
  providers: [VisitesService, RolesGuard],
  controllers: [VisitesController],
})
export class VisitesModule {}