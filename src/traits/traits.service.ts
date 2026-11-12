import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CreateTraitDto } from './dto/create-trait.dto.js';
import { UpdateTraitDto } from './dto/update-trait.dto.js';
import { Trait } from './trait.entity.js';

@Injectable()
export class TraitsService {
  private traits: Trait[];

  constructor() {
    const filepath = join(process.cwd(), 'src', 'data', 'gurps_traits.json');
    this.traits = JSON.parse(readFileSync(filepath, 'utf-8')) as Trait[];
  }

  findAll(category?: string): Trait[] {
    if (!category) {
      return this.traits;
    }
    return this.traits.filter((t) => t.category === category);
  }

  findOne(id: number): Trait {
    const trait = this.traits.find((t) => t.id === id);
    if (!trait) {
      throw new NotFoundException(`Trait dengan id ${id} tidak ditemukan`);
    }
    return trait;
  }

  create(createTraitDto: CreateTraitDto): Trait {
    const isDuplicate = this.traits.some(
      (t) =>
        t.trait_name.trim().toLowerCase() ===
        createTraitDto.trait_name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      throw new ConflictException(
        `Trait dengan nama '${createTraitDto.trait_name}' sudah ada`,
      );
    }

    const maxId = this.traits.reduce((max, t) => (t.id > max ? t.id : max), 0);
    const newTrait: Trait = {
      id: maxId + 1,
      trait_name: createTraitDto.trait_name,
      type: createTraitDto.type,
      category: createTraitDto.category,
      notes: createTraitDto.notes ?? '',
      is_custom: true,
    };

    this.traits.push(newTrait);
    return newTrait;
  }

  update(id: number, updateTraitDto: UpdateTraitDto): Trait {
    const index = this.traits.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Trait dengan id ${id} tidak ditemukan`);
    }

    if (updateTraitDto.trait_name) {
      const isDuplicate = this.traits.some(
        (t) =>
          t.id !== id &&
          t.trait_name.trim().toLowerCase() ===
            updateTraitDto.trait_name!.trim().toLowerCase(),
      );
      if (isDuplicate) {
        throw new ConflictException(
          `Trait dengan nama '${updateTraitDto.trait_name}' sudah ada`,
        );
      }
    }

    const updatedTrait: Trait = Object.assign(
      {},
      this.traits[index],
      updateTraitDto,
      { id },
    );

    this.traits[index] = updatedTrait;
    return updatedTrait;
  }

  remove(id: number): Trait {
    const index = this.traits.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Trait dengan id ${id} tidak ditemukan`);
    }
    const [deletedTrait] = this.traits.splice(index, 1);
    return deletedTrait;
  }
}
