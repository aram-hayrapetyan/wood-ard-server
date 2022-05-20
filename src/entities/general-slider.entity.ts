import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GeneralSlider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    order: number;
}