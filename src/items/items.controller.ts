import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import sharp = require('sharp');
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
    async getPublicItems(@Req() req, @Res() res: Response, @Query() query_params: any) {
        let items = await this.itemService.getItems(true, query_params);

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
            await this.itemService.addItems(body);

            let items = await this.itemService.getItems();

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
            await this.itemService.editItem(parseInt(id), body);
            
            let items = await this.itemService.getItems();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was updated.', data: items });
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
            await this.itemService.removeItem(parseInt(id));

            let items = await this.itemService.getItems();

            return res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Item was removed from system.', data: items });
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
            await this.itemService.deleteRestoreItem(parseInt(id), false);
            
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
            await this.itemService.deleteRestoreItem(parseInt(id), true);
            
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

                if (!existsSync('public/items/thumbnail')){
                    mkdirSync('public/items/thumbnail');
                }

                return cb(null, 'public/items');
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
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Param('id') id: string
    ) {
        try {
            let item = await this.itemService.getItem(parseInt(id));
            
            if (files.length) {
                await this.itemService.storeItemImages(files, item);
    
                for (let file of files) {
                    let buff = readFileSync(`public/items/${file.filename}`)
                    
                    sharp(buff)
                        .resize(160, 120)
                        .toFile(`public/items/thumbnail/thumb_${file.filename}`, (err, info) => { console.log(err, info) });
                }
            }

            let items = await this.itemService.getItems();

            return res.status(HttpStatus.CREATED).json({ response: 'Successful image uploading', data: items });
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

            if (removed.affected) {
                let path_arr = image.split('/');
                path_arr[2] = 'thumbnail/thumb_' +  path_arr[2];

                unlinkSync(`${process.cwd()}/${image}`);
                unlinkSync(`${process.cwd()}/${path_arr.join('/')}`);
            }

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
            let { image, thumb } = await this.itemService.getItemImage(parseInt(image_id));

            await this.itemService.setItemGeneralImage(parseInt(id), image, thumb);

            let items = await this.itemService.getItems();

            return res.status(201).json({ response: 'Successful general image set', data: items });
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }
    
}
