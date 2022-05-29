import { IsNotEmpty } from "class-validator";

export class CreateTypesDTO {
    @IsNotEmpty()
    name: string;

    description?: string;
}