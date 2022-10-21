import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { Connection } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private connection: Connection,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.connection.createQueryBuilder(User, 'user').getMany();
  }

  async findOne(email: string): Promise<User> {
    return await this.connection.createQueryBuilder(User, 'user')
      .where('user.email=:email', { email })
      .getOne();
  }
}