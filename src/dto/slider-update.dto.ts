import { IsNotEmpty, Min } from "class-validator";

export class SliderUpdateDTO {
    @Min(1)
    @IsNotEmpty()
    id: number;

    @Min(1)
    @IsNotEmpty()
    order: number;
}