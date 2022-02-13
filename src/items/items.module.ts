import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../entities/items.entity';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemAlbum } from '../entities/item-album.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Item, ItemAlbum
    ])
  ],
  providers: [ItemsService],
  exports: [ItemsService],
  controllers: [ItemsController]
})
export class ItemsModule {}
