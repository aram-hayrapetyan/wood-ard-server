import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { CreateItemsDTO } from 'src/dto/items-create.dto';
import { UpdateItemsDTO } from 'src/dto/items-update.dto';
import { Item } from 'src/entities/items.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
    constructor(
        private connection: Connection,
        @InjectRepository(Item) public readonly itemEntityRepository: Repository<Item>
    ) {}

    async getAll(): Promise<any[]> {
        try {
            const data = readFileSync(`${process.cwd()}/assets/jsons/items.json`, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err)
        }
    }

    async getItems(): Promise<any[]> {
      return await this.itemEntityRepository.find();
    }

    async addItems(item: CreateItemsDTO): Promise<any> {
        let newItem = new Item();

        newItem.name     = item.name;
        newItem.type     = item.type;
        newItem.material = item.material;
        newItem.size     = item.size;

        return await newItem.save();
    }

    async editItem(id: number, item: UpdateItemsDTO): Promise<any> {
        return await this.connection.createQueryBuilder()
            .update(Item)
            .set(item)
            .where('item.id=:id', { id })
            .returning('*')
            .execute();
    }

    async deleteRestoreItem(id: number, restore: boolean): Promise<any> {
        return await this.connection.createQueryBuilder()
            .update(Item)
            .set({
                deleted: !restore,
                deleted_at: restore ? null: new Date()
            })
            .where('item.id=:id', { id })
            .returning('*')
            .execute();
    }

    async removeItem(id: number): Promise<any> {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(Item)
            .where('item.id=:id', { id })
            .returning('*')
            .execute();
    }
}
