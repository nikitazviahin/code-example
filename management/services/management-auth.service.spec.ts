import { Test, TestingModule } from '@nestjs/testing';
import { ManagementAuthService } from './management-auth.service';

describe('ManagementAuthService', () => {
  let service: ManagementAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementAuthService],
    }).compile();

    service = module.get<ManagementAuthService>(ManagementAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
