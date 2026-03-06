import { PartialType } from '@nestjs/mapped-types';
import { CreateCharacterSpellDto } from './create-character-spell.dto';

export class UpdateCharacterSpellDto extends PartialType(CreateCharacterSpellDto) {}
