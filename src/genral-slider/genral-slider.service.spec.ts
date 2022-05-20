import { Test, TestingModule } from '@nestjs/testing';
import { GenralSliderService } from './genral-slider.service';

describe('GenralSliderService', () => {
  let service: GenralSliderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenralSliderService],
    }).compile();

    service = module.get<GenralSliderService>(GenralSliderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
