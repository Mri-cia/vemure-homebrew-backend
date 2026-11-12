import { PartialType } from '@nestjs/mapped-types';
import { CreateTraitDto } from './create-trait.dto.js';

export class UpdateTraitDto extends PartialType(CreateTraitDto) {}
