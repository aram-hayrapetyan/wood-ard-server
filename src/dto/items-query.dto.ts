import { IsIn, IsOptional, Min } from "class-validator";

export class ItemsQueryDTO {
    @Min(0)
    @IsOptional()
    readonly skip?: number = 0;

    @Min(1)
    @IsOptional()
    readonly limit?: number = 10;

    @Min(-1)
    @IsOptional()
    readonly type?: number;
}