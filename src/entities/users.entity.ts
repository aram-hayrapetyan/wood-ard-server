import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    first_name: string;
    
    @Column({ type: 'text' })
    last_name: string;
} 