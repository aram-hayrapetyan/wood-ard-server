import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import sharp = require('sharp');
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GenralSliderService } from './genral-slider.service';
import { SliderUpdateDTO } from '../dto';

@Controller('slider')
export class GenralSliderController {
    constructor(
        private sliderService: GenralSliderService,
      ) {}

    @Get()
    public async getImagesForSlider(@Req() req, @Res() res: Response, 
        @Query('thumbnail') thumbnail: string
    ): Promise<void> {
        try {
            let slider = await this.sliderService.getSlider(thumbnail);
            
            res.status(HttpStatus.OK).json(slider);
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: function (req, file, cb) {
                if (!existsSync('public/slider')){
                    mkdirSync('public/slider', { recursive: true });
                }

                if (!existsSync('public/slider/thumbnail')){
                    mkdirSync('public/slider/thumbnail', { recursive: true });
                }

                return cb(null, 'public/slider');
            },
            filename: function (req, file, cb) {
                const extention = file.originalname.split('.').pop();

                cb(null, `${Date.now()}${Math.floor(100 + Math.random()*899)}_slider.${extention}`);
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
    @Post()
    public async uploadImagesSlider(@Req() req, @Res() res: Response, 
        @UploadedFile() file: Express.Multer.File
    ): Promise<void> {
        try {
            let last_order_number = (await this.sliderService.lastOrderNumber())[0]?.last_order_number||0;

            await this.sliderService.createSlider({ image: file.path, order: last_order_number + 1 });
        
            let buff = readFileSync(`public/slider/${file.filename}`);
            
            sharp(buff)
                .resize(160, 120)
                .toFile(`public/slider/thumbnail/thumb_${file.filename}`, (err, info) => { console.log(err, info) });

            let slider = await this.sliderService.getSlider('');
            
            res.status(HttpStatus.CREATED).json({ success: true, response: 'Successful image uploading', data: slider });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('order')
    async restoreItem(
        @Req() req, 
        @Res() res: Response, 
        @Body() body: SliderUpdateDTO[]
    ): Promise<void> {
        try {
            let updated = await this.sliderService.updateSliderOrder(body);
            
            let slider = await this.sliderService.getSlider();
            
            res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Slider orders were updated.', data: slider });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteSlider(
        @Req() req, 
        @Res() res: Response, 
        @Param('id') id: string
    ): Promise<void> {
        try {
            let { image } = await this.sliderService.getOne(parseInt(id));

            let deleted = await this.sliderService.deleteSlider(parseInt(id));
            
            if (deleted.affected) {
                let path_arr = image.split('/');
                path_arr[2] = 'thumbnail/thumb_' +  path_arr[2];

                unlinkSync(`${process.cwd()}/${image}`);
                unlinkSync(`${process.cwd()}/${path_arr.join('/')}`);
            }

            let slider = await this.sliderService.getSlider();

            res.status(HttpStatus.ACCEPTED).send({ success: true, message: 'Slider image was removed from system.', data: slider });
        } catch (e) {
            res.status(HttpStatus.BAD_REQUEST).send({ success: false, message: e.message });
        }
    }
    
}
