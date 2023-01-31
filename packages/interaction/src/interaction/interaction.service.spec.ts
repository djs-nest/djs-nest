import { DiscoveryService } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { InteractionHandlerService } from './interaction-handler.interface';
import { InteractionService } from './interaction.service';

class TestHandler extends InteractionHandlerService {
  handleInteraction = jest.fn();
}

describe('InteractionService', () => {
  let service: InteractionService;
  let handlers: InteractionHandlerService[];

  beforeEach(async () => {
    handlers = [new TestHandler(), new TestHandler(), new TestHandler(), new TestHandler(), new TestHandler()];

    const providers: any[] = handlers.map(value => ({ instance: value }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [InteractionService, { provide: DiscoveryService, useValue: { getProviders: jest.fn().mockReturnValue(providers) } }]
    }).compile();

    service = module.get<InteractionService>(InteractionService);

    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call handleInteraction on all handlers', () => {
    service.handleInteraction({} as any);
    for (const handler of handlers) {
      expect(handler.handleInteraction).toHaveBeenCalledTimes(1);
    }
  });
});
