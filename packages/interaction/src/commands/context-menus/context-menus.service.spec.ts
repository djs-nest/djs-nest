import {
  APIContextMenuInteraction,
  APIInteractionDataResolvedGuildMember,
  APIMessage,
  APIUser,
  ApplicationCommandType,
  InteractionType,
  MessageType
} from '@discordjs/core';
import {
  DjsCommonModule,
  DjsContext,
  ExplorerService,
  MessageCommandInteractionContext,
  UserCommandInteractionContext
} from '@djs-nest/common';
import { Injectable } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ContextMenusService } from './context-menus.service';
import { MessageCommand, TargetMember, TargetMessage, TargetUser, UserCommand } from './decorators';

@Injectable()
class ContextMenusTestService {
  @UserCommand({ name: 'Get user', description: 'Get user info' })
  getUser(
    @DjsContext() []: UserCommandInteractionContext,
    @TargetUser() user: APIUser | undefined,
    @TargetMember() member: APIInteractionDataResolvedGuildMember | undefined
  ) {
    return `${user?.username},${member?.nick}`;
  }

  @MessageCommand({ name: 'Message content', description: 'View message content' })
  messageContent(@DjsContext() []: MessageCommandInteractionContext, @TargetMessage() message: APIMessage) {
    return message.content;
  }
}

function baseComponentInteraction(): APIContextMenuInteraction {
  return {
    id: '1',
    type: InteractionType.ApplicationCommand,
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
    },
    data: {} as any
  };
}

describe('ContextMenusService', () => {
  let contextMenusService: ContextMenusService;
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule, DiscoveryModule],
      providers: [ContextMenusService, ContextMenusTestService]
    }).compile();

    contextMenusService = module.get<ContextMenusService>(ContextMenusService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);

    jest.spyOn(explorerService, 'explore');

    await contextMenusService.onModuleInit();
  });

  it('should be defined', () => {
    expect(contextMenusService).toBeDefined();
  });

  describe('`Get user` command', () => {
    it('should handle interaction', async () => {
      const result = await contextMenusService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          name: 'Get user',
          type: ApplicationCommandType.User,
          target_id: '12345',
          resolved: {
            users: {
              '12345': {
                username: 'USERNAME'
              }
            },
            members: {
              '12345': {
                nick: 'NICKNAME'
              }
            }
          }
        }
      } as any);

      expect(result).toBe('USERNAME,NICKNAME');
    });
  });

  describe('`Message content` command', () => {
    it('should handle interaction', async () => {
      const result = await contextMenusService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          name: 'Message content',
          type: ApplicationCommandType.Message,
          target_id: '67890',
          resolved: {
            messages: {
              '67890': {
                content: 'MESSAGE CONTENT'
              }
            }
          }
        }
      } as any);

      expect(result).toBe('MESSAGE CONTENT');
    });
  });
});
