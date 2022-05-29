import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./items.entity";

@Entity({ name: 'types' })
export class Types extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Item,  item => item.type_key)
    @JoinTable()
    item: Item[];
} 