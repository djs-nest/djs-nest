import { ApplicationCommandType } from '@discordjs/core';
import { DJS_INTERACTION_MODULE_OPTIONS, DjsApi, DjsCommonModule, ExplorerService, SlashCommandDiscovery } from '@djs-nest/common';
import { DjsRestModule } from '@djs-nest/rest';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DjsInteractionModule } from '../djs-interaction.module';
import { CommandsService } from './commands.service';
import { ContextMenusService } from './context-menus';
import { SlashCommandsService } from './slash-commands';

const APPLICATION_ID = '123456789012345678';

describe('CommandsService', () => {
  let service: CommandsService;
  let contextMenusService: ContextMenusService;
  let slashCommandsService: SlashCommandsService;
  let explorerService: ExplorerService<any>;
  let mockDjsApi: DjsApi;

  async function createMockDjs() {
    mockDjsApi = {
      applicationCommands: {
        bulkOverwriteGuildCommands: jest.fn(),
        bulkOverwriteGlobalCommands: jest.fn()
      },
      users: {
        getCurrent: jest.fn().mockResolvedValue({ id: APPLICATION_ID })
      }
    } as any;
  }

  async function setup(module: TestingModule) {
    service = module.get<CommandsService>(CommandsService);
    contextMenusService = module.get<ContextMenusService>(ContextMenusService);
    slashCommandsService = module.get<SlashCommandsService>(SlashCommandsService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);

    jest.spyOn(explorerService, 'explore');
    jest.spyOn(slashCommandsService, 'getCommands');
    jest.spyOn(slashCommandsService, 'handleInteraction');
    jest.spyOn(contextMenusService, 'getCommands');
    jest.spyOn(contextMenusService, 'handleInteraction');

    await contextMenusService.onModuleInit();
    await slashCommandsService.onModuleInit();
  }

  describe('no provided DjsApi', () => {
    beforeEach(async () => {
      await createMockDjs();

      const module: TestingModule = await Test.createTestingModule({
        imports: [DjsCommonModule, DiscoveryModule],
        providers: [CommandsService, ContextMenusService, SlashCommandsService, { provide: DJS_INTERACTION_MODULE_OPTIONS, useValue: {} }]
      }).compile();

      await setup(module);

      jest.spyOn(service, 'registerCommands');
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should not register commands', async () => {
      await service.onApplicationBootstrap();
      expect(service.registerCommands).not.toHaveBeenCalled();
    });
  });

  describe('provided DjsApi', () => {
    beforeEach(async () => {
      await createMockDjs();

      const module: TestingModule = await Test.createTestingModule({
        imports: [DjsCommonModule, DiscoveryModule],
        providers: [
          CommandsService,
          ContextMenusService,
          SlashCommandsService,
          { provide: DJS_INTERACTION_MODULE_OPTIONS, useValue: {} },
          { provide: DjsApi, useValue: mockDjsApi }
        ]
      }).compile();

      await setup(module);

      jest.spyOn(service, 'registerCommands');
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should register commands', async () => {
      await service.onApplicationBootstrap();
      expect(service.registerCommands).toHaveBeenCalledTimes(1);
    });
  });

  describe('provided DjsRestModule', () => {
    beforeEach(async () => {
      await createMockDjs();

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          DjsCommonModule,
          DjsRestModule.forRootAsync({ useFactory: () => ({ token: '' }) }),
          DjsInteractionModule,
          DiscoveryModule
        ],
        providers: [{ provide: DJS_INTERACTION_MODULE_OPTIONS, useValue: {} }]
      }).compile();

      await setup(module);

      jest.spyOn(service, 'registerCommands');
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should register commands', async () => {
      await service.onApplicationBootstrap();
      expect(service.registerCommands).toHaveBeenCalledTimes(1);
    });
  });

  describe('no provided DjsRestModule', () => {
    beforeEach(async () => {
      await createMockDjs();

      const module: TestingModule = await Test.createTestingModule({
        imports: [DjsCommonModule, DjsInteractionModule, DiscoveryModule],
        providers: [{ provide: DJS_INTERACTION_MODULE_OPTIONS, useValue: {} }]
      }).compile();

      await setup(module);

      jest.spyOn(service, 'registerCommands');
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should register commands', async () => {
      await service.onApplicationBootstrap();
      expect(service.registerCommands).not.toHaveBeenCalled();
    });
  });

  describe('registerCommands', () => {
    beforeEach(async () => {
      await createMockDjs();

      const module: TestingModule = await Test.createTestingModule({
        imports: [DjsCommonModule, DiscoveryModule],
        providers: [CommandsService, ContextMenusService, SlashCommandsService, { provide: DJS_INTERACTION_MODULE_OPTIONS, useValue: {} }]
      }).compile();

      await setup(module);

      jest.spyOn(service, 'registerCommands');
    });

    it('should register commands only global', async () => {
      await service.registerCommands(mockDjsApi);
      expect(service.registerCommands).toHaveBeenCalledTimes(1);
      expect(slashCommandsService.getCommands).toHaveBeenCalledTimes(1);
      expect(contextMenusService.getCommands).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.users.getCurrent).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGuildCommands).not.toHaveBeenCalled();
    });

    it('should register commands for guilds', async () => {
      const newSlash = new SlashCommandDiscovery({
        type: ApplicationCommandType.ChatInput,
        name: 'test',
        description: 'test desc',
        guilds: ['654321']
      });
      newSlash.setDiscoveryMeta({ class: jest.fn(), handler: jest.fn() });
      slashCommandsService.add(newSlash);

      await service.registerCommands(mockDjsApi);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledWith(APPLICATION_ID, expect.any(Array));
      expect(mockDjsApi.applicationCommands.bulkOverwriteGuildCommands).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGuildCommands).toHaveBeenCalledWith(APPLICATION_ID, '654321', expect.any(Array));
    });

    it('should not fetch application id if provided', async () => {
      await service.registerCommands(mockDjsApi, APPLICATION_ID);
      expect(service.registerCommands).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.users.getCurrent).not.toHaveBeenCalled();
    });

    it('should not fetch application id if cached already', async () => {
      await service.registerCommands(mockDjsApi);
      await service.registerCommands(mockDjsApi);
      expect(service.registerCommands).toHaveBeenCalledTimes(2);
      expect(mockDjsApi.users.getCurrent).toHaveBeenCalledTimes(1);
      expect(mockDjsApi.applicationCommands.bulkOverwriteGlobalCommands).toHaveBeenCalledTimes(2);
    });
  });
});
