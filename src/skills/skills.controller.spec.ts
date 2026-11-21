import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from './skills.controller.js';
import { SkillsService } from './skills.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('SkillsController', () => {
  let controller: SkillsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
