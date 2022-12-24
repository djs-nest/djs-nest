import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService, ContextMenusService, SlashCommandsService } from './commands';
import { DjsInteractionModule } from './djs-interaction.module';
import { InteractionService } from './interaction';
import { MessageComponentsService } from './message-components';
import { ModalsService } from './modals';

describe('DjsInteractionModule', () => {
  let commandsService: CommandsService;
  let slashCommandsService: SlashCommandsService;
  let contextMenusService: ContextMenusService;
  let messageComponentsService: MessageComponentsService;
  let modalsService: ModalsService;
  let interactionService: InteractionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsInteractionModule.forRoot()]
    }).compile();

    commandsService = module.get<CommandsService>(CommandsService);
    slashCommandsService = module.get<SlashCommandsService>(SlashCommandsService);
    contextMenusService = module.get<ContextMenusService>(ContextMenusService);
    messageComponentsService = module.get<MessageComponentsService>(MessageComponentsService);
    modalsService = module.get<ModalsService>(ModalsService);
    interactionService = module.get<InteractionService>(InteractionService);
  });

  it('should provide all services', () => {
    expect(commandsService).toBeDefined();
    expect(slashCommandsService).toBeDefined();
    expect(contextMenusService).toBeDefined();
    expect(messageComponentsService).toBeDefined();
    expect(modalsService).toBeDefined();
    expect(interactionService).toBeDefined();
  });
});
