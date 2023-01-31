import { GatewayDispatchEvents } from '@discordjs/core';
import { DJS_EVENTS_METADATA, DjsCommonModule, ExplorerService } from '@djs-nest/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DjsService } from '../djs.service';
import { On, Once } from './decorators';
import { EventsService } from './events.service';

class EventsServiceTest {
  @Once(GatewayDispatchEvents.Ready)
  ready() {
    return;
  }

  @On(GatewayDispatchEvents.MessageCreate)
  messageCreate() {
    return;
  }
}

describe('EventsService', () => {
  let eventsService: EventsService;
  let djsService: DjsService;
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule],
      providers: [EventsServiceTest, EventsService, { provide: DjsService, useValue: { client: { on: jest.fn(), once: jest.fn() } } }]
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);
    djsService = module.get<DjsService>(DjsService);

    jest.spyOn(explorerService, 'explore');
  });

  it('should be defined', () => {
    expect(eventsService).toBeDefined();
  });

  it('should register once events', async () => {
    await eventsService.onModuleInit();
    expect(explorerService.explore).toHaveBeenCalledWith(DJS_EVENTS_METADATA);
    expect(djsService.client.once).toHaveBeenCalledWith(GatewayDispatchEvents.Ready, expect.any(Function));
  });

  it('should register on events', async () => {
    await eventsService.onModuleInit();
    expect(explorerService.explore).toHaveBeenCalledWith(DJS_EVENTS_METADATA);
    expect(djsService.client.on).toHaveBeenCalledWith(GatewayDispatchEvents.MessageCreate, expect.any(Function));
  });
});
