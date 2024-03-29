import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, DeleteResult, InsertResult, Repository } from 'typeorm';
import { GeneralSlider } from '../entities/general-slider.entity';
import {
    SliderCreateDTO,
    SliderUpdateDTO,
} from '../dto';

@Injectable()
export class GenralSliderService {
    constructor(
        private connection: Connection,
        @InjectRepository(GeneralSlider) public readonly sliderEntityRepository: Repository<GeneralSlider>
    ) {}

    async getSlider(thumbnail?: string): Promise<any[]> {
        let slider: any[] = await this.connection.query(`
            SELECT * FROM \`general_slider\` ORDER BY \`order\` ASC;
        `);

        if (thumbnail) {
            slider = slider.map(slide => { 
                let image_arr = slide.image.split('/');
                image_arr[2] = 'thumbnail/thumb_' +  image_arr[2];
                return { ...slide, image: image_arr.join('/') } 
            });
        }
        
        return slider;
    }

    async getOne(id: number): Promise<GeneralSlider> {
        return await this.sliderEntityRepository.findOne(id);
    }

    async lastOrderNumber(): Promise<any[]> {
        return await this.connection.query(`
            SELECT MAX(\`order\`) AS last_order_number FROM \`general_slider\`;
        `);
    }

    async createSlider(body: SliderCreateDTO): Promise<InsertResult> {
        return await this.connection.createQueryBuilder()
            .insert()
            .into(GeneralSlider)
            .values(body)
            .execute();
    }

    async updateSliderOrder(body: SliderUpdateDTO[]): Promise<any> {
        return await this.connection.query(`
            UPDATE \`general_slider\` SET \`order\` = CASE
                ${body.map(one => `WHEN id = ${one.id} THEN ${one.order}`).join('\n')}
                ELSE \`order\`
                END
            WHERE id IN (${body.map(one => one.id).join(',')});
        `);
    }

    async deleteSlider(id: number): Promise<DeleteResult> {
        return await this.connection.createQueryBuilder()
            .delete()
            .from(GeneralSlider)
            .where('general_slider.id=:id', { id })
            .execute();
    }
    
}
