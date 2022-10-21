import { Validate } from "class-validator";
import { Types } from "src/entities/types.entity";
import isValid from "./validators/is-valid";

export class ItemsUpdateDTO {
    readonly type?: string;

    @Validate(isValid, [Types, 'id'])
    readonly type_id?: number;

    readonly name?: string;

    readonly material?: string;

    readonly details?: string;
    
    readonly image?: string;

    readonly price?: number;
}