import { IsNotEmpty } from "class-validator";

export class TypesCreateDTO {
    @IsNotEmpty()
    name: string;

    description?: string;
}