import { ApplicationCommandOptionType } from '@discordjs/core';
import { BaseCommandMeta, DJS_SUBCOMMAND_GROUP_METADATA, SlashCommandDiscovery, SlashCommandMeta } from '@djs-nest/common';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { noop } from 'rxjs';
import { SlashCommand } from './slash-command.decorator';

const SubcommandGroup = (options?: BaseCommandMeta) =>
  SetMetadata(
    DJS_SUBCOMMAND_GROUP_METADATA,
    new SlashCommandDiscovery({
      type: ApplicationCommandOptionType.SubcommandGroup,
      ...options
    })
  );

export type CommandGroupOptions = Omit<SlashCommandMeta, 'type'>;

export const createCommandGroupDecorator = (rootOptions: CommandGroupOptions) => {
  const rootCommand = SlashCommand(rootOptions);

  return (subCommandOptions?: CommandGroupOptions): ClassDecorator => {
    const subCommandGroup = subCommandOptions ? SubcommandGroup(subCommandOptions) : noop;

    return applyDecorators(rootCommand, subCommandGroup);
  };
};
