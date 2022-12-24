import { Test, TestingModule } from '@nestjs/testing';
import { DjsCommonModule } from './djs-common.module';
import { ExplorerService } from './explorer.service';

describe('DjsCommonModule', () => {
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule]
    }).compile();

    explorerService = module.get<ExplorerService<any>>(ExplorerService);
  });

  it('should provide ExplorerService', () => {
    expect(explorerService).toBeDefined();
  });
});
