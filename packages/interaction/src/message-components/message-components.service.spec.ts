import { APIBaseInteraction, APIMessageComponentInteractionData, ComponentType, InteractionType, MessageType } from '@discordjs/core';
import {
  ButtonInteractionContext,
  ChannelSelectInteractionContext,
  DjsCommonModule,
  DjsContext,
  ExplorerService,
  MentionableSelectInteractionContext,
  RoleSelectInteractionContext,
  StringSelectInteractionContext,
  UserSelectInteractionContext
} from '@djs-nest/common';
import { Injectable } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
  Button,
  ChannelSelect,
  ComponentParam,
  ISelectedChannels,
  ISelectedMembers,
  ISelectedRoles,
  ISelectedUsers,
  MentionableSelect,
  RoleSelect,
  SelectedChannels,
  SelectedMembers,
  SelectedRoles,
  SelectedStrings,
  SelectedUsers,
  StringSelect,
  UserSelect
} from './decorators';
import { MessageComponentsService } from './message-components.service';

function baseComponentInteraction(): APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData> {
  return {
    id: '1',
    type: InteractionType.MessageComponent,
    application_id: '2',
    token: 'token',
    version: 1,
    locale: 'en-US',
    app_permissions: '0',
    channel_id: '4',
    message: {
      id: '3',
      channel_id: '4',
      author: {
        id: '5',
        username: 'username',
        discriminator: '0000',
        avatar: 'avatar'
      },
      content: 'content',
      timestamp: '2021-01-01T00:00:00.000Z',
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      mention_roles: [],
      attachments: [],
      embeds: [],
      pinned: false,
      type: MessageType.Default
    }
  };
}

@Injectable()
class TestMessageComponentService {
  @Button('BUTTON/:value')
  onButton(@DjsContext() []: ButtonInteractionContext, @ComponentParam('value') _value: string) {
    return 'BUTTON/:value';
  }

  @StringSelect('STRING_SELECT_MENU')
  onStringSelect(@DjsContext() []: StringSelectInteractionContext, @SelectedStrings() _selected: string[]) {
    return 'STRING_SELECT_MENU';
  }

  @ChannelSelect('CHANNEL_SELECT_MENU')
  onChannelSelect(@DjsContext() []: ChannelSelectInteractionContext, @SelectedChannels() _channels: ISelectedChannels) {
    return 'CHANNEL_SELECT_MENU';
  }

  @UserSelect('USER_SELECT_MENU')
  onUserSelect(
    @DjsContext() []: UserSelectInteractionContext,
    @SelectedUsers() _users: ISelectedUsers,
    @SelectedMembers() _members: ISelectedMembers
  ) {
    return 'USER_SELECT_MENU';
  }

  @RoleSelect('ROLE_SELECT_MENU')
  onRoleSelect(@DjsContext() []: RoleSelectInteractionContext, @SelectedRoles() _roles: ISelectedRoles) {
    return 'ROLE_SELECT_MENU';
  }

  @MentionableSelect('MENTIONABLE_SELECT_MENU')
  onMentionableSelect(
    @DjsContext() []: MentionableSelectInteractionContext,
    @SelectedUsers() _users: ISelectedUsers,
    @SelectedMembers() _members: ISelectedMembers,
    @SelectedRoles() _roles: ISelectedRoles
  ) {
    return 'MENTIONABLE_SELECT_MENU';
  }
}

describe('MessageComponentsService', () => {
  let messageComponentsService: MessageComponentsService;
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule, DiscoveryModule],
      providers: [MessageComponentsService, TestMessageComponentService]
    }).compile();

    messageComponentsService = module.get<MessageComponentsService>(MessageComponentsService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);

    jest.spyOn(explorerService, 'explore');
    jest.spyOn(messageComponentsService, 'add');

    await messageComponentsService.onModuleInit();
  });

  it('should be defined', () => {
    expect(messageComponentsService).toBeDefined();
  });

  it('should register components', () => {
    expect(explorerService.explore).toHaveBeenCalled();

    expect(messageComponentsService.add).toHaveBeenCalledTimes(6);
  });

  describe.each([
    {
      name: '@Button',
      meta: { type: ComponentType.Button, customId: 'BUTTON/:value' },
      testData: {
        custom_id: 'BUTTON/1234',
        component_type: ComponentType.Button
      }
    },
    {
      name: '@StringSelect',
      meta: { type: ComponentType.StringSelect, customId: 'STRING_SELECT_MENU' },
      testData: {
        custom_id: 'STRING_SELECT_MENU',
        component_type: ComponentType.StringSelect,
        values: ['string']
      }
    },
    {
      name: '@ChannelSelect',
      meta: { type: ComponentType.ChannelSelect, customId: 'CHANNEL_SELECT_MENU' },
      testData: {
        custom_id: 'CHANNEL_SELECT_MENU',
        component_type: ComponentType.ChannelSelect,
        values: ['15'],
        resolved: {
          channels: {
            '15': { id: '15' }
          }
        }
      }
    },
    {
      name: '@UserSelect',
      meta: { type: ComponentType.UserSelect, customId: 'USER_SELECT_MENU' },
      testData: {
        custom_id: 'USER_SELECT_MENU',
        component_type: ComponentType.UserSelect,
        values: ['25'],
        resolved: {
          users: {
            '25': { id: '25' }
          },
          members: {
            '25': { id: '25', nick: 'nick' }
          }
        }
      }
    },
    {
      name: '@RoleSelect',
      meta: { type: ComponentType.RoleSelect, customId: 'ROLE_SELECT_MENU' },
      testData: {
        custom_id: 'ROLE_SELECT_MENU',
        component_type: ComponentType.RoleSelect,
        values: ['35'],
        resolved: {
          roles: {
            '35': { id: '35' }
          }
        }
      }
    },
    {
      name: '@MentionableSelect',
      meta: { type: ComponentType.MentionableSelect, customId: 'MENTIONABLE_SELECT_MENU' },
      testData: {
        custom_id: 'MENTIONABLE_SELECT_MENU',
        component_type: ComponentType.MentionableSelect,
        values: ['45'],
        resolved: {
          users: {
            '45': { id: '45' }
          }
        }
      }
    }
  ])('$name', ({ name, meta, testData }) => {
    it(`should register ${name} declarations`, () => {
      expect(messageComponentsService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          meta
        })
      );
    });

    it(`should handle ${name} interaction`, async () => {
      const result = await messageComponentsService.handleInteraction({
        ...(baseComponentInteraction() as any),
        data: testData
      });

      expect(result).toBe(meta.customId);
    });
  });
});
