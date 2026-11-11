import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Trait } from './trait.entity.js';

@Injectable()
export class TraitsService {
    private traits: Trait[]

    constructor(){
        const filepath = join(process.cwd(), 'src', 'data', 'gurps_traits.json');
        this.traits = JSON.parse(readFileSync(filepath, 'utf-8')) as Trait[]
    }

    findAll(category?: string): Trait[]{
        if (!category){
            return this.traits;
        }

        return this.traits.filter((t) => t.category === category)
    }
}
