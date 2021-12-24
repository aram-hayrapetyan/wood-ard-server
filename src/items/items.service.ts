import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

export type Item = any;

@Injectable()
export class ItemsService {

    async getAll(): Promise<Item[]> {
        try {
            const data = readFileSync(`${process.cwd()}/assets/jsons/items.json`, 'utf8');
            return JSON.parse(data);
          } catch (err) {
            console.error(err)
          }
    }
}
