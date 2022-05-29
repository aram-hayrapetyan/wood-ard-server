import { Injectable } from '@nestjs/common';
import { CreateTypesDTO } from '../dto/type-create.dto';
import { Types } from '../entities/types.entity';
import { Connection } from 'typeorm';
import { UpdateTypesDTO } from 'src/dto/type-update.dto';

@Injectable()
export class TypesService {
    constructor(
        private connection: Connection,
    ) {}

    async getTypes() {
        return await this.connection.createQueryBuilder(Types, 'types').getMany();
    }

    async addType(type: CreateTypesDTO) {
        let newType = new Types();

        newType.name        = type.name;
        newType.description = type.description;
        
        return await newType.save();
    }

    async updateType(id: number, type: UpdateTypesDTO) {
        return await this.connection.createQueryBuilder()
            .update(Types)
            .set(type)
            .where('types.id=:id', { id })
            .execute();
    }

    async deleteType(id: number) {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(Types)
            .where('types.id=:id', { id })
            .execute();
    }
}
