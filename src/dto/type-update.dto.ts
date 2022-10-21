import { IsNotEmpty } from "class-validator";

export class TypesUpdateDTO {
    @IsNotEmpty()
    description: string;
}