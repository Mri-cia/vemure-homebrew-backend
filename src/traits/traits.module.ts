import { Module } from '@nestjs/common';
import { TraitsController } from './traits.controller.js';
import { TraitsService } from './traits.service.js';

@Module({
    controllers: [TraitsController],
    providers: [TraitsService]
})
export class TraitsModule {}
