import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Character } from './characters/entities/character.entity';
import { Attributes } from './characters/entities/attributes.entity';
import { Skills } from './skills/entities/skills.entity';
import { CharacterSkills } from './characters/entities/character-skills.entity';
import { SkillsModule } from './skills/skills.module';
import { CharacterModule } from './characters/characters.module';
import { InventoryItem } from './inventory/entities/inventory-item.entity';
import { InventoryModule } from './inventory/inventory.module';
import { Race } from './race/entities/race.entity';
import { SubRace } from './race/entities/sub-race.entity';
import { RaceModule } from './race/race.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'rpg@park',
      database: 'rpg-de-mesa',
      entities: [
        User,
        Character,
        Attributes,
        Skills,
        CharacterSkills,
        InventoryItem,
        Race,
        SubRace,
      ],
      synchronize: true, // Use apenas em desenvolvimento
    }),
    UserModule,
    AuthModule,
    SkillsModule,
    CharacterModule,
    InventoryModule,
    RaceModule,
  ],
})
export class AppModule {}