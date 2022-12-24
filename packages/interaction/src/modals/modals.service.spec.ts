import { APIModalSubmitInteraction, ComponentType, InteractionType, ModalSubmitComponent } from '@discordjs/core';
import { DjsCommonModule, DjsContext, ExplorerService, ModalInteractionContext } from '@djs-nest/common';
import { Injectable } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Modal, ModalField, ModalFields, ModalParam } from './decorators';
import { ModalsService } from './modals.service';

@Injectable()
class TestModalService {
  @Modal('food/:name')
  favoriteFood(
    @DjsContext() []: ModalInteractionContext,
    @ModalFields() _fields: Map<string, ModalSubmitComponent>,
    @ModalFields('topping') topping: ModalSubmitComponent,
    @ModalField('topping') toppingValue: string,
    @ModalParam('name') food: string,
    @ModalParam() _params: object
  ) {
    return `${food} with ${topping.value}(${toppingValue})`;
  }
}

function baseComponentInteraction(): APIModalSubmitInteraction {
  return {
    id: '1',
    type: InteractionType.ModalSubmit,
    application_id: '2',
    token: 'token',
    version: 1,
    locale: 'en-US',
    app_permissions: '0',
    channel_id: '4',
    data: {} as any
  };
}

describe('ModalsService', () => {
  let modalService: ModalsService;
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule, DiscoveryModule],
      providers: [ModalsService, TestModalService]
    }).compile();

    modalService = module.get<ModalsService>(ModalsService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);

    jest.spyOn(explorerService, 'explore');
    jest.spyOn(modalService, 'add');

    await modalService.onModuleInit();
  });

  it('should be defined', () => {
    expect(modalService).toBeDefined();
  });

  it('should register modals', () => {
    expect(explorerService.explore).toHaveBeenCalled();

    expect(modalService.add).toHaveBeenCalledTimes(1);
  });

  it('should handle modal interaction', async () => {
    const result = await modalService.handleInteraction({
      ...baseComponentInteraction(),
      data: {
        custom_id: 'food/pizza',
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              {
                type: ComponentType.TextInput,
                custom_id: 'topping',
                value: 'pepperoni'
              }
            ]
          }
        ]
      }
    });

    expect(result).toBe('pizza with pepperoni(pepperoni)');
  });
});
