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
        CharacterSkills
      ],
      synchronize: true, // Use apenas em desenvolvimento
    }),
    UserModule,
    AuthModule,
    SkillsModule,
    CharacterModule
  ],
})
export class AppModule {}