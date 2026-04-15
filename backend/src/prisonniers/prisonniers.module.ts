import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prisonnier } from './prisonnier.entity';
import { PrisonniersController } from './prisonniers.controller';
import { PrisonniersService } from './prisonniers.service';
import { Cellule } from 'src/cellules/cellule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prisonnier, Cellule])],
  controllers: [PrisonniersController],
  providers: [PrisonniersService]
})
export class PrisonniersModule {}
