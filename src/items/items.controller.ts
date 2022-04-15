import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateItemsDTO } from '../dto/items-create.dto';
import { UpdateItemsDTO } from '../dto/items-update.dto';
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

    @Get('public')
    async getPublicItems(@Req() req, @Res() res: Response) {
        let items = await this.itemService.getItems(true);

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

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was updated.', data: updated });
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

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was removed from system.', data: removed });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/delete')
    async deleteItem(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ) {
        try {
            let deleted = await this.itemService.deleteRestoreItem(parseInt(id), false);
            
            let items = await this.itemService.getItems();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was deleted.', data: items });
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
            
            let items = await this.itemService.getItems();
            
            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was restored.', data: items });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseInterceptors(FilesInterceptor('files', 5, {
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
    public async uploadImagesForItem(@Req() req, @Res() res: Response, 
        @UploadedFiles() files,
        @Param('id') id: string
    ) {
        try {
            let item = await this.itemService.getItem(parseInt(id));
            
            let store = await this.itemService.storeItemImages(files, item);
            return res.status(200).json({ response: 'Successful image uploading', data: store });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('image/:image_id')
    public async deleteImageForItem(@Req() req, @Res() res: Response, 
        @Param('image_id') image_id: string
    ) {
        try {
            let { image, id } = await this.itemService.getItemImage(parseInt(image_id));

            let removed = await this.itemService.removeItemImage(id);

            if (removed.affected) unlinkSync(`${process.cwd()}/${image}`);

            let items = await this.itemService.getItems();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item Image was deleted.', data: items });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }

    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/image/:image_id')
    public async setGeneralImageForItem(@Req() req, @Res() res: Response, 
        @Param('id') id: string,
        @Param('image_id') image_id: string
    ) {
        try {
            let { image } = await this.itemService.getItemImage(parseInt(image_id));

            await this.itemService.setItemGeneralImage(parseInt(id), image);

            let items = await this.itemService.getItems();
            return res.status(201).json({ response: 'Successful general image set', data: items });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }
    
}
