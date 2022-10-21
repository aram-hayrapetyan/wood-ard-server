import { Injectable } from '@nestjs/common';
import { Connection, DeleteResult, UpdateResult } from 'typeorm';
import { Types } from '../entities/types.entity';
import {
    TypesCreateDTO,
    TypesUpdateDTO,
} from '../dto';

@Injectable()
export class TypesService {
    constructor(
        private connection: Connection,
    ) {}

    async getTypes() {
        return await this.connection.createQueryBuilder(Types, 'types').getMany();
    }

    async addType(type: TypesCreateDTO): Promise<Types> {
        let newType = new Types();

        newType.name        = type.name;
        newType.description = type.description;
        
        return await newType.save();
    }

    async updateType(id: number, type: TypesUpdateDTO): Promise<UpdateResult> {
        return await this.connection.createQueryBuilder()
            .update(Types)
            .set(type)
            .where('types.id=:id', { id })
            .execute();
    }

    async deleteType(id: number): Promise<DeleteResult> {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(Types)
            .where('types.id=:id', { id })
            .execute();
    }
}
