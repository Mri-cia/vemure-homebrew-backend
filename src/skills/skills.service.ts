import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { Skill } from './entities/skill.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Skill[]> {
    return this.prisma.skill.findMany();
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill dengan id ${id} tidak ditemukan`);
    }
    return skill;
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const trimmedName = createSkillDto.skill_name.trim();
    const existing = await this.prisma.skill.findFirst({
      where: {
        skill_name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
      },
    });
    if (existing) {
      throw new ConflictException(
        `Skill dengan nama '${createSkillDto.skill_name}' sudah ada`,
      );
    }

    return this.prisma.skill.create({
      data: {
        skill_name: trimmedName,
        attribute: createSkillDto.attribute,
        difficulty: createSkillDto.difficulty,
        notes: createSkillDto.notes ?? '',
        requires_specialization:
          createSkillDto.requires_specialization ?? false,
      },
    });
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    await this.findOne(id);

    const dataToUpdate: UpdateSkillDto = Object.assign({}, updateSkillDto);
    if (updateSkillDto.skill_name) {
      const trimmedName = updateSkillDto.skill_name.trim();
      const existing = await this.prisma.skill.findFirst({
        where: {
          id: { not: id },
          skill_name: {
            equals: trimmedName,
            mode: 'insensitive',
          },
        },
      });
      if (existing) {
        throw new ConflictException(
          `Skill dengan nama '${updateSkillDto.skill_name}' sudah ada`,
        );
      }
      dataToUpdate.skill_name = trimmedName;
    }

    return this.prisma.skill.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number): Promise<Skill> {
    await this.findOne(id);
    return this.prisma.skill.delete({ where: { id } });
  }
}
