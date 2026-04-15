import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prisonnier } from './prisonnier.entity';
import { PrisonniersController } from './prisonniers.controller';
import { PrisonniersService } from './prisonniers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prisonnier])],
  controllers: [PrisonniersController],
  providers: [PrisonniersService]
})
export class PrisonniersModule {}
