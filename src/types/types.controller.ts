import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TypesService } from './types.service';
import {
    TypesCreateDTO,
    TypesUpdateDTO,
} from '../dto';

@Controller('types')
export class TypesController {
    constructor(
        private typesService: TypesService,
      ) {}

    @Get()
    async getTypes(@Req() req, @Res() res: Response): Promise<void> {
        let types = await this.typesService.getTypes();

        res.status(HttpStatus.OK).send(types);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addTypes(
        @Req() req,
        @Res() res: Response,
        @Body() body: TypesCreateDTO,
    ): Promise<void> {
        try {
            await this.typesService.addType(body);

            let types = await this.typesService.getTypes();

            res.status(HttpStatus.CREATED).send({ success: true, data: types });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string,
        @Body() body: TypesUpdateDTO
    ): Promise<void> {
        try {
            await this.typesService.updateType(parseInt(id), body);
            
            let types = await this.typesService.getTypes();

            res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Type was updated.', data: types });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ): Promise<void> {
        try {
            await this.typesService.deleteType(parseInt(id));

            let types = await this.typesService.getTypes();

            res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was removed from system.', data: types });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }
}
