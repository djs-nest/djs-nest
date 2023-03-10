import {
  APIApplicationCommandAutocompleteInteraction,
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  InteractionType,
  MessageType
} from '@discordjs/core';
import {
  CommandOptionsResolver,
  DjsCommonModule,
  DjsContext,
  ExplorerService,
  MemberUser,
  SlashCommandInteractionContext
} from '@djs-nest/common';
import { UseInterceptors } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AutocompleteInterceptor } from './autocomplete';
import { createCommandGroupDecorator, SlashCommand, Subcommand } from './decorators';
import {
  AttachmentOption,
  BooleanOption,
  ChannelOption,
  DjsOptions,
  IntegerOption,
  MemberOption,
  MemberUserOption,
  MemberValue,
  MentionableOption,
  MentionableValue,
  NumberOption,
  RoleOption,
  StringOption,
  UserOption,
  UserValue
} from './options';
import { SlashCommandsService } from './slash-commands.service';

class ColorAutocompleteInterceptor extends AutocompleteInterceptor {
  transformOptions(_: APIApplicationCommandAutocompleteInteraction, hoisted: CommandOptionsResolver) {
    hoisted.getFocused(true);
    return;
  }
}

class HelloDto {
  @StringOption({ name: 'stringOption', description: 'Your text', required: true })
  readonly stringOption: string;

  @BooleanOption({ name: 'booleanOption', description: 'string' })
  readonly booleanOption: boolean;

  @IntegerOption({ name: 'integerOption', description: 'integer' })
  readonly integerOption?: number;

  @NumberOption({ name: 'numberOption', description: 'number', required: true })
  readonly numberOption: number;

  @MemberOption({ name: 'memberOption', description: 'member' })
  readonly memberOption: APIInteractionDataResolvedGuildMember | null;

  @MemberValue({ name: 'memberOption', description: 'member' })
  readonly memberValue: APIInteractionDataResolvedGuildMember | null;

  @MemberUserOption({ name: 'memberOption', description: 'member' })
  readonly memberUserValue: MemberUser | null;

  @UserOption({ name: 'userOption', description: 'user', required: true })
  readonly userOption: APIUser | null;

  @UserValue({ name: 'userOption', description: 'user', required: true })
  readonly userValue: APIUser | null;

  @ChannelOption({ name: 'channelOption', description: 'channel' })
  readonly channelOption: APIInteractionDataResolvedChannel | null;

  @RoleOption({ name: 'roleOption', description: 'role', required: true })
  readonly roleOption: APIRole | null;

  @MentionableOption({ name: 'mentionableOption', description: 'mentionable' })
  readonly mentionableOption: APIInteractionDataResolvedGuildMember | APIUser | APIRole | null;

  @MentionableValue({ name: 'mentionableOption', description: 'mentionable' })
  readonly mentionableValue: APIInteractionDataResolvedGuildMember | APIUser | APIRole | null;

  @AttachmentOption({ name: 'attachmentOption', description: 'attachment' })
  readonly attachmentOption: APIAttachment | null;
}

class AutoDto {
  @StringOption({ name: 'stringOption', description: 'Your text', autocomplete: true, required: true })
  readonly stringOption: string;
}

const TestCommands = createCommandGroupDecorator({ name: 'test', description: 'Test commands' });
const TestGroupCommandsRoot = createCommandGroupDecorator({ name: 'group', description: 'Test sub group' });
const TestGroupCommandsSub = () => TestGroupCommandsRoot({ name: 'sub', description: 'Test sub group' });

class SlashCommandsTestService {
  @SlashCommand({ name: 'solo', description: 'solo command' })
  onSolo(@DjsContext() []: SlashCommandInteractionContext) {
    return 'solo';
  }
}

@TestCommands()
class SlashCommandsGroupTestService {
  @Subcommand({ name: 'ping', description: 'Ping-pong command' })
  onPing(@DjsContext() []: SlashCommandInteractionContext) {
    return 'ping';
  }

  @Subcommand({ name: 'hello', description: 'Hello user' })
  onHello(@DjsContext() []: SlashCommandInteractionContext, @DjsOptions() {}: HelloDto) {
    return 'hello';
  }

  @Subcommand({ name: 'auto', description: 'Auto complete' })
  @UseInterceptors(ColorAutocompleteInterceptor)
  onAuto(@DjsContext() []: SlashCommandInteractionContext, @DjsOptions() {}: AutoDto) {
    return 'auto';
  }
}

@TestGroupCommandsSub()
class SlashCommandsSubGroupTestService {
  @Subcommand({ name: 'nested', description: 'nested command' })
  onPing(@DjsContext() [interaction]: SlashCommandInteractionContext) {
    expect(interaction).toBeTruthy();
    return 'nested';
  }
}

function baseComponentInteraction(): APIChatInputApplicationCommandInteraction {
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

describe('SlashCommandsService', () => {
  let slashCommandsService: SlashCommandsService;
  let explorerService: ExplorerService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DjsCommonModule, DiscoveryModule],
      providers: [SlashCommandsService, SlashCommandsTestService, SlashCommandsGroupTestService, SlashCommandsSubGroupTestService]
    }).compile();

    slashCommandsService = module.get<SlashCommandsService>(SlashCommandsService);
    explorerService = module.get<ExplorerService<any>>(ExplorerService);

    jest.spyOn(explorerService, 'explore');
    jest.spyOn(slashCommandsService, 'add');
    jest.spyOn(slashCommandsService, 'addSubCommand');

    await slashCommandsService.onModuleInit();
  });

  it('should be defined', () => {
    expect(slashCommandsService).toBeDefined();
  });

  it('should register commands', () => {
    expect(explorerService.explore).toHaveBeenCalled();

    // Add called for each parent command
    expect(slashCommandsService.add).toHaveBeenCalledTimes(3);
    // Add called for each subcommand
    expect(slashCommandsService.addSubCommand).toHaveBeenCalledTimes(4);
  });

  describe('`solo` command', () => {
    it('should handle interaction', async () => {
      const result = await slashCommandsService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          type: ApplicationCommandType.ChatInput,
          name: 'solo'
        }
      });

      expect(result).toBe('solo');
    });
  });

  describe('`test ping` command', () => {
    it('should handle interaction', async () => {
      const result = await slashCommandsService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          type: ApplicationCommandType.ChatInput,
          name: 'test',
          options: [{ name: 'ping', type: ApplicationCommandOptionType.Subcommand }]
        }
      });

      expect(result).toBe('ping');
    });
  });

  describe('`test hello` command', () => {
    it('should handle interaction', async () => {
      const result = await slashCommandsService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          type: ApplicationCommandType.ChatInput,
          name: 'test',
          options: [
            {
              name: 'hello',
              type: ApplicationCommandOptionType.Subcommand,
              options: [
                { name: 'stringOption', type: ApplicationCommandOptionType.String, value: 'string' },
                { name: 'booleanOption', type: ApplicationCommandOptionType.Boolean, value: true },
                { name: 'integerOption', type: ApplicationCommandOptionType.Integer, value: 1 },
                { name: 'numberOption', type: ApplicationCommandOptionType.Number, value: 1.1 },
                { name: 'memberOption', type: ApplicationCommandOptionType.User, value: '1' },
                { name: 'userOption', type: ApplicationCommandOptionType.User, value: '2' },
                { name: 'channelOption', type: ApplicationCommandOptionType.Channel, value: '3' },
                { name: 'roleOption', type: ApplicationCommandOptionType.Role, value: '4' },
                { name: 'mentionableOption', type: ApplicationCommandOptionType.Mentionable, value: '5' },
                { name: 'attachmentOption', type: ApplicationCommandOptionType.Attachment, value: '6' }
              ]
            }
          ],
          resolved: {
            users: { '2': { id: '2' } as any },
            members: { '1': { id: '1' } as any, '5': { id: '5' } as any },
            channels: { '3': { id: '3' } as any },
            roles: { '4': { id: '4' } as any },
            attachments: { '6': { id: '6' } as any }
          }
        }
      });

      expect(result).toBe('hello');
    });
  });

  describe('`test auto` command', () => {
    it('should handle autocomplete interaction', async () => {
      const result = await slashCommandsService.handleInteraction({
        ...baseComponentInteraction(),
        type: InteractionType.ApplicationCommandAutocomplete,
        data: {
          id: '1',
          type: ApplicationCommandType.ChatInput,
          name: 'test',
          options: [
            {
              name: 'auto',
              type: ApplicationCommandOptionType.Subcommand,
              options: [{ name: 'stringOption', type: ApplicationCommandOptionType.String, value: 'string', focused: true }]
            }
          ]
        }
      });

      expect(result).toBeUndefined();
    });
  });

  describe('`group sub nested` command', () => {
    it('should handle interaction', async () => {
      const result = await slashCommandsService.handleInteraction({
        ...baseComponentInteraction(),
        data: {
          id: '1',
          type: ApplicationCommandType.ChatInput,
          name: 'group',
          options: [
            {
              name: 'sub',
              type: ApplicationCommandOptionType.SubcommandGroup,
              options: [{ name: 'nested', type: ApplicationCommandOptionType.Subcommand }]
            }
          ]
        }
      });

      expect(result).toBe('nested');
    });
  });
});
