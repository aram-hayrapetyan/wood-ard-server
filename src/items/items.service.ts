import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { CreateItemsDTO } from '../dto/items-create.dto';
import { UpdateItemsDTO } from '../dto/items-update.dto';
import { ItemAlbum } from '../entities/item-album.entity';
import { Item } from '../entities/items.entity';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
    constructor(
        private connection: Connection,
        @InjectRepository(ItemAlbum) public readonly itemAlbumEntityRepository: Repository<ItemAlbum>
    ) {}

    async getAll(): Promise<any[]> {
        try {
            const data = readFileSync(`${process.cwd()}/assets/jsons/items.json`, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error(err)
        }
    }

    async getItems(visible: boolean = false): Promise<any[]> {
        let query = this.connection.createQueryBuilder(Item, 'item')
            .leftJoinAndSelect('item.album', 'album');
        
        if (visible) {
            query.where('item.deleted IS NULL');
        }
        return await query.getMany();
    }

    async getItem(id: number) {
        return await this.connection.createQueryBuilder(Item, 'item')
            .leftJoinAndSelect('item.album', 'album')
            .where('item.id=:id', { id })
            .getOne();
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
        console.log({id, item})
        return await this.connection.createQueryBuilder()
            .update(Item)
            .set(item)
            .where('item.id=:id', { id })
            .execute();
    }

    async deleteRestoreItem(id: number, restore: boolean): Promise<any> {
        return await this.connection.createQueryBuilder()
            .update(Item)
            .set({
                deleted: !restore||null,
                deleted_at: restore ? null: new Date()
            })
            .where('item.id=:id', { id })
            .execute();
    }

    async removeItem(id: number): Promise<any> {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(Item)
            .where('item.id=:id', { id })
            .execute();
    }

    async getItemImage(image_id: number) {
        return await this.itemAlbumEntityRepository.findOne(image_id);
    }

    async storeItemImages(files: any, item: Item) {
        let storeData = files.map(file => {
            return { item, image: file.path }
        })

        return await this.connection.createQueryBuilder()
            .insert()
            .into(ItemAlbum)
            .values(storeData)
            .execute();
    }

    async removeItemImage(id: number): Promise<any> {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(ItemAlbum)
            .where('item_album.id=:id', { id })
            .execute();
    }

    async setItemGeneralImage(id: number, image: string) {
        return await this.connection.createQueryBuilder()
            .update(Item)
            .set({image})
            .where('item.id=:id', { id })
            .execute();
    }
}
