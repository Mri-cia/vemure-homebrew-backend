import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';
import { Skill } from './entities/skill.entity.js';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class SkillsService {
  private skills: Skill[];

  constructor() {
    const filepath = join(process.cwd(), 'src', 'data', 'gurps_skills.json');
    this.skills = JSON.parse(readFileSync(filepath, 'utf-8')) as Skill[];
  }

  findAll() {
    return this.skills;
  }

  create(createSkillDto: CreateSkillDto) {
    return 'This action adds a new skill';
  }



  findOne(id: number) {
    return `This action returns a #${id} skill`;
  }

  update(id: number, updateSkillDto: UpdateSkillDto) {
    return `This action updates a #${id} skill`;
  }

  remove(id: number) {
    return `This action removes a #${id} skill`;
  }
}
