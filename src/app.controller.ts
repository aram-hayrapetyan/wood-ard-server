import { Controller, Request, Post, UseGuards, Get, Param, Res } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { ItemsService } from './items/items.service';
import { join } from 'path';
import { readdir } from 'fs';

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

  @Get('public/:dir')
  async getFiles(@Param() params: any, @Request() req: any, @Res() res: any) {
    const {dir} = params;

    readdir(join(process.cwd(), 'public', dir), (err, files) => {
      if (err) {
        return res.status(404).end();
      }

      const resFiles = [];

      for (let file of files) {
        if (file !== '.DS_Store') {
          resFiles.push({
            id: Date.now(),
            path: req.url + '/' + file
          })
        }
      }

      res.send(resFiles);
    })
  }

  @Get('public/:dir/:file')
  async getFile(@Param() params: any, @Res() res: any) {
    const {dir, file} = params;

    res.sendFile(join(process.cwd(), 'public', dir, file), function (err) {
        if (err) {
          return res.status(404).end();
        }
    })
  }
}
