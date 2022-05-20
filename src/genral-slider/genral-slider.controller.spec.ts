import { Test, TestingModule } from '@nestjs/testing';
import { GenralSliderController } from './genral-slider.controller';

describe('GenralSliderController', () => {
  let controller: GenralSliderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenralSliderController],
    }).compile();

    controller = module.get<GenralSliderController>(GenralSliderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
