import { IsNotEmpty, Validate } from 'class-validator';
import { Types } from '../entities/types.entity';
import isValid from './validators/is-valid';

export class ItemsCreateDTO {
    @IsNotEmpty()
    readonly type: string;

    @Validate(isValid, [Types, 'id'])
    readonly type_id?: number;

    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    readonly material: string;
    
    readonly details?: string;

    @IsNotEmpty()
    readonly price: number;
}