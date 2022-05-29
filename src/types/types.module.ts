import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Types } from '../entities/types.entity';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Types
    ])
  ],
  controllers: [TypesController],
  providers: [TypesService]
})
export class TypesModule {}
