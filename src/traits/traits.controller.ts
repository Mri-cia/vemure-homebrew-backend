import { Controller, Get, Query } from '@nestjs/common';
import { TraitsService } from './traits.service.js';

@Controller('traits')
export class TraitsController {
  constructor(private readonly traitService: TraitsService) {}

  @Get()
  findAll(@Query('category_eq') category?: string) {
    return this.traitService.findAll(category);
  }
}
