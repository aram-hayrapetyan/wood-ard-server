import { IsNotEmpty, Min } from "class-validator";

export class SliderCreateDTO {
    @IsNotEmpty()
    image: string;

    @Min(1)
    @IsNotEmpty()
    order: number;
}