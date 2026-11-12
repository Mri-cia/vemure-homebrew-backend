import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TraitsService } from './traits.service.js';
import { CreateTraitDto } from './dto/create-trait.dto.js';
import { UpdateTraitDto } from './dto/update-trait.dto.js';

@Controller('traits')
export class TraitsController {
  constructor(private readonly traitsService: TraitsService) {}

  @Post()
  create(@Body() createTraitDto: CreateTraitDto) {
    return this.traitsService.create(createTraitDto);
  }

  @Get()
  findAll(@Query('category_eq') category?: string) {
    return this.traitsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.traitsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTraitDto: UpdateTraitDto,
  ) {
    return this.traitsService.update(id, updateTraitDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.traitsService.remove(id);
  }
}
