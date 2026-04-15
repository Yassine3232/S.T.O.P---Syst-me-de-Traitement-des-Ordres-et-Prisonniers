import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cellule } from './cellule.entity';
import { CellulesController } from './cellules.controller';
import { CellulesService } from './cellules.service';
import { Prisonnier } from 'src/prisonniers/prisonnier.entity';
import { CellulesSeeder } from './cellules.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Cellule, Prisonnier])],
  controllers: [CellulesController],
  providers: [CellulesService, CellulesSeeder],
  exports: [TypeOrmModule],
})
export class CellulesModule {}
