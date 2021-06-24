import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { ItemsService } from './items/items.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private userService: UsersService,
    private itemService: ItemsService,
  ) {}

  @Get('message')
  getHello(): { message: string } {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.findOne(req.user.email);
  }

  @Get('users')
  async getUsers(@Request() req) {
    return await this.userService.getAll();
  }

  @Get('items')
  async getItems(@Request() req) {
    return await this.itemService.getAll();
  }
}
