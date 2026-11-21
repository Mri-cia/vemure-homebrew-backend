import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTraitDto } from './dto/create-trait.dto.js';
import { UpdateTraitDto } from './dto/update-trait.dto.js';
import { Trait } from './trait.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TraitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string): Promise<Trait[]> {
    if (!category) {
      return this.prisma.trait.findMany();
    }
    return this.prisma.trait.findMany({
      where: { category },
    });
  }

  async findOne(id: number): Promise<Trait> {
    const trait = await this.prisma.trait.findUnique({ where: { id } });
    if (!trait) {
      throw new NotFoundException(`Trait dengan id ${id} tidak ditemukan`);
    }
    return trait;
  }

  async create(createTraitDto: CreateTraitDto): Promise<Trait> {
    const trimmedName = createTraitDto.trait_name.trim();
    const existing = await this.prisma.trait.findFirst({
      where: {
        trait_name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
      },
    });
    if (existing) {
      throw new ConflictException(
        `Trait dengan nama '${createTraitDto.trait_name}' sudah ada`,
      );
    }

    return this.prisma.trait.create({
      data: {
        trait_name: trimmedName,
        type: createTraitDto.type,
        category: createTraitDto.category,
        notes: createTraitDto.notes ?? '',
        is_custom: true,
      },
    });
  }

  async update(id: number, updateTraitDto: UpdateTraitDto): Promise<Trait> {
    await this.findOne(id);

    const dataToUpdate: UpdateTraitDto = Object.assign({}, updateTraitDto);
    if (updateTraitDto.trait_name) {
      const trimmedName = updateTraitDto.trait_name.trim();
      const existing = await this.prisma.trait.findFirst({
        where: {
          id: { not: id },
          trait_name: {
            equals: trimmedName,
            mode: 'insensitive',
          },
        },
      });
      if (existing) {
        throw new ConflictException(
          `Trait dengan nama '${updateTraitDto.trait_name}' sudah ada`,
        );
      }
      dataToUpdate.trait_name = trimmedName;
    }

    return this.prisma.trait.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number): Promise<Trait> {
    await this.findOne(id);
    return this.prisma.trait.delete({ where: { id } });
  }
}
