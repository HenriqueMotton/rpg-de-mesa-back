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
import { CharacterSpell } from './spells/entities/character-spell.entity';
import { DndSpell } from './spells/entities/dnd-spell.entity';
import { SpellsModule } from './spells/spells.module';
import { DndClass } from './classes/entities/dnd-class.entity';
import { ClassesModule } from './classes/classes.module';
import { CharacterEquipment } from './equipment/entities/character-equipment.entity';
import { EquipmentModule } from './equipment/equipment.module';
import { Kit } from './kits/entities/kit.entity';
import { KitsModule } from './kits/kits.module';
import { InitiativeSession } from './initiative/entities/initiative-session.entity';
import { InitiativeModule } from './initiative/initiative.module';
import { MonstersModule } from './monsters/monsters.module';
import { DndMonster } from './monsters/entities/dnd-monster.entity';
import { PriceItemsModule } from './price-items/price-items.module';
import { PriceItem } from './price-items/entities/price-item.entity';
import { BugReportsModule } from './bug-reports/bug-reports.module';
import { BugReport } from './bug-reports/entities/bug-report.entity';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/entities/chat-message.entity';
import { Background } from './backgrounds/entities/background.entity';
import { BackgroundsModule } from './backgrounds/backgrounds.module';
import { Trauma } from './psychology/entities/trauma.entity';
import { PsychologyModule } from './psychology/psychology.module';
import { CustomNpc } from './custom-npcs/entities/custom-npc.entity';
import { CustomNpcsModule } from './custom-npcs/custom-npcs.module';

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
        CharacterSpell,
        DndSpell,
        DndClass,
        CharacterEquipment,
        Kit,
        InitiativeSession,
        DndMonster,
        PriceItem,
        BugReport,
        ChatMessage,
        Background,
        Trauma,
        CustomNpc,
      ],
      synchronize: true, // Use apenas em desenvolvimento
    }),
    UserModule,
    AuthModule,
    SkillsModule,
    CharacterModule,
    InventoryModule,
    RaceModule,
    SpellsModule,
    ClassesModule,
    EquipmentModule,
    KitsModule,
    InitiativeModule,
    MonstersModule,
    PriceItemsModule,
    BugReportsModule,
    ChatModule,
    BackgroundsModule,
    PsychologyModule,
    CustomNpcsModule,
  ],
})
export class AppModule {}