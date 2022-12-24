import { ApplicationCommandType } from '@discordjs/core';
import { BaseRootCommandMeta, DJS_SLASH_COMMAND_METADATA, SlashCommandDiscovery } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const SlashCommand = (options: BaseRootCommandMeta): MethodDecorator =>
  SetMetadata<string, SlashCommandDiscovery>(
    DJS_SLASH_COMMAND_METADATA,
    new SlashCommandDiscovery({
      type: ApplicationCommandType.ChatInput,
      ...options
    })
  );
