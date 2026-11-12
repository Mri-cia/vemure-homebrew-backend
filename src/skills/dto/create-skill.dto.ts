import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  skill_name: string;

  @IsIn(['ST', 'DX', 'IQ', 'HT', 'Per', 'Will'])
  attribute: string;

  @IsIn(['Easy', 'Average', 'Hard', 'Very Hard'])
  difficulty: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  requires_specialization?: boolean;
}
