import { APIInteraction } from '@discordjs/core';
import {
  CommandDiscovery,
  DJS_SLASH_COMMAND_METADATA,
  DJS_SUBCOMMAND_GROUP_METADATA,
  DJS_SUBCOMMAND_METADATA,
  ExplorerService,
  isAutocomplete,
  isChatInputCommand,
  SlashCommandDiscovery
} from '@djs-nest/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InteractionHandlerService } from '../../interaction';

@Injectable()
export class SlashCommandsService extends InteractionHandlerService implements OnModuleInit {
  private readonly slashCommands = new Map<string, SlashCommandDiscovery>();

  constructor(private readonly explorerService: ExplorerService<SlashCommandDiscovery>, private readonly reflector: Reflector) {
    super();
  }

  async onModuleInit() {
    this.explorerService.explore(DJS_SLASH_COMMAND_METADATA).forEach(command => this.add(command));

    return this.explorerService.explore(DJS_SUBCOMMAND_METADATA).forEach(subcommand => this.addSubCommand(subcommand));
  }

  handleInteraction(interaction: APIInteraction): Promise<any> {
    if (!isChatInputCommand(interaction) && !isAutocomplete(interaction)) return;

    return this.slashCommands.get(interaction.data.name)?.execute(interaction);
  }

  getCommands(): CommandDiscovery[] {
    return [...this.slashCommands.values()];
  }

  addSubCommand(subCommand: SlashCommandDiscovery): void {
    const rootCommand = this.reflector.get<SlashCommandDiscovery>(DJS_SLASH_COMMAND_METADATA, subCommand.getClass());
    const subCommandGroup = this.reflector.get<SlashCommandDiscovery>(DJS_SUBCOMMAND_GROUP_METADATA, subCommand.getClass());

    if (!rootCommand) {
      throw new ReferenceError(`Can't register subcommand "${subCommand.getName()}", missing root command`);
    }

    if (subCommandGroup) {
      subCommandGroup.setCommand(subCommand);
      rootCommand.setCommand(subCommandGroup);
    } else {
      rootCommand.setCommand(subCommand);
    }

    if (!this.slashCommands.has(rootCommand.getName())) {
      this.add(rootCommand);
    }
  }

  add(command: SlashCommandDiscovery): void {
    this.slashCommands.set(command.getName(), command);
  }

  remove(commandName: string): boolean {
    return this.slashCommands.delete(commandName);
  }
}
