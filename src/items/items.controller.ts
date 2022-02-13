import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateItemsDTO } from 'src/dto/items-create.dto';
import { UpdateItemsDTO } from 'src/dto/items-update.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
    constructor(
        private itemService: ItemsService,
      ) {}

    @Get()
    async getItems(@Req() req, @Res() res: Response) {
        let items = await this.itemService.getItems();

        return res.status(HttpStatus.OK).send(items);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addItems(
        @Req() req,
        @Res() res: Response,
        @Body() body: CreateItemsDTO,
    ) {
        try {
            let items = await this.itemService.addItems(body);

            return res.status(HttpStatus.CREATED).send({ success: true, data: items });
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
        @Body() body: UpdateItemsDTO
    ) {
        try {
            let updated = await this.itemService.editItem(parseInt(id), body);
            console.log(updated);

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Items was updated.', data: updated });
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
            let removed = await this.itemService.removeItem(parseInt(id));
            console.log(removed)

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Items was removed from system.', data: removed });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/delete')
    async deleteItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ) {
        try {
            let deleted = await this.itemService.deleteRestoreItem(parseInt(id), false);
            console.log(deleted);

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Items was deleted.', data: deleted });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/restore')
    async restoreItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ) {
        try {
            let restored = await this.itemService.deleteRestoreItem(parseInt(id), true);
            console.log(restored);
            
            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Items was restored.', data: restored });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: function (req, file, cb) {
                if (!existsSync('public/items')){
                    mkdirSync('public/items');
                }
                return cb(null, 'public/items');
                // cb(null, `${process.cwd()}/public/items`);
            },
            filename: function (req, file, cb) {
                const extention = file.originalname.split('.').pop();

                cb(null, `${Date.now()}${Math.floor(100 + Math.random()*899)}.${extention}`);
            },
        }),
        fileFilter: async (req, file: any, cb) => {
            
            if (!/\.(jpe?g|png|JPE?G|PNG)$/i.test(file.originalname)) {
                return cb(new Error('Uploaded file must have image mimetype'), false);
            }

            return cb(null, true);
        }
    }))
    @UseGuards(JwtAuthGuard)
    @Post(':id/image')
    public async uploadImageForUser(@Req() req, @Res() res: Response, 
        @UploadedFile() file,
        @Param('id') id: string
    ) {
        try {
            console.log(req)
            console.log(file, id)
            return res.status(200).json({ response: 'Successful image uploading' });
        } catch (err) {
        }
    }
    
}
