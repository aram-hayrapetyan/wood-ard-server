import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTypesDTO } from 'src/dto/type-create.dto';
import { UpdateTypesDTO } from 'src/dto/type-update.dto';
import { TypesService } from './types.service';

@Controller('types')
export class TypesController {
    constructor(
        private typesService: TypesService,
      ) {}

    @Get()
    async getTypes(@Req() req, @Res() res: Response) {
        let types = await this.typesService.getTypes();

        return res.status(HttpStatus.OK).send(types);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addTypes(
        @Req() req,
        @Res() res: Response,
        @Body() body: CreateTypesDTO,
    ) {
        try {
            await this.typesService.addType(body);

            let types = await this.typesService.getTypes();

            return res.status(HttpStatus.CREATED).send({ success: true, data: types });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async editItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string,
        @Body() body: UpdateTypesDTO
    ) {
        try {
            await this.typesService.updateType(parseInt(id), body);
            
            let types = await this.typesService.getTypes();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Type was updated.', data: types });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ) {
        try {
            await this.typesService.deleteType(parseInt(id));

            let types = await this.typesService.getTypes();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was removed from system.', data: types });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }
}
