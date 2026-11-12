import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { Skill } from './entities/skill.entity.js';

@Injectable()
export class SkillsService {
  private skills: Skill[];

  constructor() {
    const filepath = join(process.cwd(), 'src', 'data', 'gurps_skills.json');
    this.skills = JSON.parse(readFileSync(filepath, 'utf-8')) as Skill[];
  }

  findAll(): Skill[] {
    return this.skills;
  }

  findOne(id: number): Skill {
    const skill = this.skills.find((s) => s.id === id);
    if (!skill) {
      throw new NotFoundException(`Skill dengan id ${id} tidak ditemukan`);
    }
    return skill;
  }

  create(createSkillDto: CreateSkillDto): Skill {
    const isDuplicate = this.skills.some(
      (s) =>
        s.skill_name.trim().toLowerCase() ===
        createSkillDto.skill_name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      throw new ConflictException(
        `Skill dengan nama '${createSkillDto.skill_name}' sudah ada`,
      );
    }

    const maxId = this.skills.reduce((max, s) => (s.id > max ? s.id : max), 0);
    const newSkill: Skill = {
      id: maxId + 1,
      skill_name: createSkillDto.skill_name,
      attribute: createSkillDto.attribute,
      difficulty: createSkillDto.difficulty,
      notes: createSkillDto.notes ?? '',
      requires_specialization:
        createSkillDto.requires_specialization ?? false,
    };

    this.skills.push(newSkill);
    return newSkill;
  }

  update(id: number, updateSkillDto: UpdateSkillDto): Skill {
    const index = this.skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Skill dengan id ${id} tidak ditemukan`);
    }

    if (updateSkillDto.skill_name) {
      const isDuplicate = this.skills.some(
        (s) =>
          s.id !== id &&
          s.skill_name.trim().toLowerCase() ===
            updateSkillDto.skill_name!.trim().toLowerCase(),
      );
      if (isDuplicate) {
        throw new ConflictException(
          `Skill dengan nama '${updateSkillDto.skill_name}' sudah ada`,
        );
      }
    }

    const updatedSkill: Skill = Object.assign(
      {},
      this.skills[index],
      updateSkillDto,
      { id },
    );

    this.skills[index] = updatedSkill;
    return updatedSkill;
  }

  remove(id: number): Skill {
    const index = this.skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Skill dengan id ${id} tidak ditemukan`);
    }
    const [deletedSkill] = this.skills.splice(index, 1);
    return deletedSkill;
  }
}
