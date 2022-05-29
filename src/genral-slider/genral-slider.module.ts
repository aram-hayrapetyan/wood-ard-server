import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralSlider } from '../entities/general-slider.entity';
import { GenralSliderController } from './genral-slider.controller';
import { GenralSliderService } from './genral-slider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GeneralSlider
    ])
  ],
  controllers: [GenralSliderController],
  providers: [GenralSliderService]
})
export class GenralSliderModule {}
