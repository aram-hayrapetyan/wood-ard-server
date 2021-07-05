import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      name: 'Asdas D\'sada',
      email: 'asdas@gmail.com',
      password: 'q1w2e3r4',
    },
    {
      userId: 2,
      name: 'Admin Super',
      email: 'admin@gmail.com',
      password: 'admin123',
    },
  ];

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }
}