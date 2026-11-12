import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTraitDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  trait_name: string;

  @IsIn(['Physical', 'Mental', 'Social'])
  type: string;

  @IsIn(['advantage', 'disadvantage', 'quirk'])
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}
