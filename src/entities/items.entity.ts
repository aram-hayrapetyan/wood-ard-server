import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ItemAlbum } from "./item-album.entity";

@Entity()
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    type: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    material: string;
    
    @Column({ type: 'text', nullable: true })
    details: string;

    @Column({ type: 'float' })
    price: number;

    @Column({ nullable: true, default: 'public/items/noImage.png' })
    image?: string;

    @Column({ type: 'boolean', nullable: true })
    deleted?: boolean;

    @Column({ nullable: true, default: 'public/items/noImage.png' })
    thumb?: string;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    created_at: Date;

    @Column({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP"
    })
    updated_at: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    deleted_at?: Date;

    @OneToMany(() => ItemAlbum,  album => album.item)
    @JoinTable()
    album: ItemAlbum[];
}