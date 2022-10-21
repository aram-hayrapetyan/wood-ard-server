import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Get()
    async getUsers(@Req() req, @Res() res: Response): Promise<void> {
      res.status(200).send(await this.userService.getAll());
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req, @Res() res: Response): Promise<void> {
      res.status(200).send(await this.userService.findOne(req.user.email));
    }
}
