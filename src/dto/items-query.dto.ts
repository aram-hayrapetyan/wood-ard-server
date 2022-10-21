import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class ItemsQueryDTO {
    @Type(() => Number)
    @Min(0)
    @IsOptional()
    readonly skip?: number = 0;

    @Type(() => Number)
    @Min(1)
    @IsOptional()
    readonly limit?: number = 10;

    @Type(() => Number)
    @Min(-1)
    @IsOptional()
    readonly type?: number;
}