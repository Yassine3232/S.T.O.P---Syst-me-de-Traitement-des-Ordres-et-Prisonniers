import { BadRequestException } from '@nestjs/common';
import { Controller, Post, Get, Patch, Body, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { CellulesService } from './cellules.service';
import { CreateCelluleDto } from './dtos/create-cellule.dto';
import { AllowedConnected } from '../guards/auth-guards';

@Controller('cellules')
export class CellulesController {
  constructor(private service: CellulesService) {}

  @AllowedConnected()
  @Post()
  async createCellule(@Body() body: CreateCelluleDto) {
    const cellule = await this.service.findByName(body.nom);

    if (cellule) {
      throw new BadRequestException('Cellule existe.');
    }

    return await this.service.create(body);
  }

  @AllowedConnected()
  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @AllowedConnected()
  @Get('/:id')
  async getCelluleById(@Param('id', ParseIntPipe) id: number) {
    const Cellule = await this.service.findById(id);
    if (!Cellule) {
      throw new NotFoundException(`Cellule avec l'id ${id} est introuvable`);
    }
    return Cellule;
  }

  @AllowedConnected()
  @Patch('/:id')
  async updateCellule(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    try {
      return await this.service.update(id, body);
    } catch (err) {
      throw new NotFoundException(`Cellule avec l'id ${id} est introuvable. Impossible de le modifier.`);
    }
  }
}
