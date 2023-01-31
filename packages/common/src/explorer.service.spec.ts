import { GatewayDispatchEvents } from '@discordjs/core';
import { SetMetadata } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { EventsDiscovery } from './discovery';
import { ExplorerService } from './explorer.service';

const TEST_METHOD_METADATA = '__METHOD_METADATA__';

const TEST_DISCOVERY = new EventsDiscovery({
  type: 'on',
  event: GatewayDispatchEvents.MessageCreate
});

const TestDecorator = () => SetMetadata(TEST_METHOD_METADATA, TEST_DISCOVERY);

class ExplorerServiceTest {
  @TestDecorator()
  testMethod() {
    return;
  }
}

describe('ExplorerService', () => {
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [ExplorerServiceTest, ExplorerService]
    }).compile();

    explorerService = module.get<ExplorerService<any>>(ExplorerService);
  });

  it('should be defined', () => {
    expect(explorerService).toBeDefined();
  });

  it('should explore should return meta', () => {
    const result = explorerService.explore(TEST_METHOD_METADATA);
    expect(result).toEqual([TEST_DISCOVERY]);
  });
});
