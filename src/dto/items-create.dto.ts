import { IsNotEmpty } from 'class-validator';

export class CreateItemsDTO {
    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly material: string;
    
    readonly details?: string;

    @IsNotEmpty()
    readonly price: number;
}