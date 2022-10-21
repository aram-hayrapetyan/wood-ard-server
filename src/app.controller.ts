import { Controller, Request, Post, UseGuards, Get, Param, Res } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { join } from 'path';
import { readdir } from 'fs';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  async get(): Promise<string> {
    return this.appService.get();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req): Promise<{access_token: string}> {
    return await this.authService.login(req.user);
  }

  @Get('public/:dir')
  async getFiles(@Param() params: any, @Request() req: any, @Res() res: any): Promise<void> {
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
  async getFile(@Param() params: any, @Res() res: any): Promise<void> {
    const {dir, file} = params;

    res.sendFile(join(process.cwd(), 'public', dir, file), function (err) {
        if (err) {
          return res.status(404).end();
        }
    });
  }

  @Get('public/:dir/thumbnail/:file')
  async getFileThumb(@Param() params: any, @Res() res: any): Promise<void> {
    const {dir, file} = params;

    res.sendFile(join(process.cwd(), 'public', dir, 'thumbnail', file), function (err) {
        if (err) {
          return res.status(404).end();
        }
    });
  }
}
