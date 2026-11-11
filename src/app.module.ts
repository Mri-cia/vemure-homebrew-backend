import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TraitsModule } from './traits/traits.module.js';
import { SkillsModule } from './skills/skills.module.js';

@Module({
  imports: [TraitsModule, SkillsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
