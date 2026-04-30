import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { Prisonnier } from '../prisonniers/prisonnier.entity';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { RolesGuard } from '../guards/roles-guards';
import { UserModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Incident, Prisonnier]), UserModule],
  providers: [IncidentsService, RolesGuard],
  controllers: [IncidentsController],
})
export class IncidentsModule {}