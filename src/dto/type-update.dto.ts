import { IsNotEmpty } from "class-validator";

export class UpdateTypesDTO {
    @IsNotEmpty()
    description: string;
}