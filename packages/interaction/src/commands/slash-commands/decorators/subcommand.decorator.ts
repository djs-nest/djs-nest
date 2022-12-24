import { ApplicationCommandOptionType } from '@discordjs/core';
import { BaseCommandMeta, DJS_SUBCOMMAND_METADATA, SlashCommandDiscovery } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const Subcommand = (options: BaseCommandMeta): MethodDecorator =>
  SetMetadata<string, SlashCommandDiscovery>(
    DJS_SUBCOMMAND_METADATA,
    new SlashCommandDiscovery({
      type: ApplicationCommandOptionType.Subcommand,
      ...options
    })
  );
