import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { Test, TestingModule } from '@nestjs/testing';
import { DjsService } from './djs.service';

describe('DjsService', () => {
  let djsService: DjsService;
  let webSocketManager: WebSocketManager;
  let rest: REST;

  beforeEach(async () => {
    rest = new REST().setToken('token');
    webSocketManager = new WebSocketManager({ token: 'token', intents: 0, rest });
    jest.spyOn(webSocketManager, 'connect').mockImplementation();
    jest.spyOn(webSocketManager, 'destroy').mockImplementation();
    jest.spyOn(webSocketManager, 'on').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DjsService, { provide: WebSocketManager, useValue: webSocketManager }, { provide: REST, useValue: rest }]
    }).compile();

    djsService = module.get<DjsService>(DjsService);
  });

  it('should be defined', () => {
    expect(djsService).toBeDefined();
  });

  it('should create a client', () => {
    expect(djsService.client).toBeDefined();
  });

  it('should listen to Closed event', () => {
    expect(webSocketManager.on).toHaveBeenCalledWith(WebSocketShardEvents.Closed, expect.any(Function));
  });

  it('should listen to Resumed event', () => {
    expect(webSocketManager.on).toHaveBeenCalledWith(WebSocketShardEvents.Resumed, expect.any(Function));
  });

  it('should connect to the gateway on bootstrap', async () => {
    await djsService.onApplicationBootstrap();
    expect(webSocketManager.connect).toHaveBeenCalled();
  });

  it('should destroy connection on shutdown', async () => {
    await djsService.onApplicationShutdown();
    expect(webSocketManager.destroy).toHaveBeenCalled();
  });
});
