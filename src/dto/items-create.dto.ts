import { IsNotEmpty } from 'class-validator';

export class CreateItemsDTO {
    @IsNotEmpty()
    readonly type: string;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly material: string;
    
    @IsNotEmpty()
    readonly size: string;

    // @IsNotEmpty()
    // readonly image: any;
}