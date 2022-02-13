import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./items.entity";

@Entity()
export class ItemAlbum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @ManyToOne(() => Item, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'item_id' })
    item: Item;
}