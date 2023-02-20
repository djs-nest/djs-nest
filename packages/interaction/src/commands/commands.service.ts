import { Snowflake } from '@discordjs/core';
import { CommandDiscovery, DJS_INTERACTION_MODULE_OPTIONS, DjsApi } from '@djs-nest/common';
import { Inject, Injectable, Logger, OnApplicationBootstrap, Optional } from '@nestjs/common';
import type { DjsInteractionModuleOptions } from '../djs-interaction-options.interface';
import { ContextMenusService } from './context-menus';
import { SlashCommandsService } from './slash-commands';

@Injectable()
export class CommandsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CommandsService.name);

  private _applicationId: Snowflake | undefined;

  constructor(
    @Inject(DJS_INTERACTION_MODULE_OPTIONS)
    private readonly options: DjsInteractionModuleOptions,
    private readonly contextMenusService: ContextMenusService,
    private readonly slashCommandsService: SlashCommandsService,
    @Optional() private readonly _api: DjsApi
  ) {}

  onApplicationBootstrap() {
    if (this.options.skipRegistration) {
      return;
    }

    if (this._api) {
      return this.registerCommands(this._api);
    }
  }

  /**
   * Register commands to Discord API. Add commands to ContextMenusService and SlashCommandsService then use registerCommands.
   * @param api
   * @param applicationId? - Application ID, if provided, will be used instead of fetching/using cached value
   */
  async registerCommands(api: DjsApi, applicationId?: Snowflake) {
    if (applicationId) {
      this._applicationId = applicationId;
    }

    const commands = [...this.contextMenusService.getCommands(), ...this.slashCommandsService.getCommands()];

    const commandsByGuildMap = new Map<string, Array<CommandDiscovery>>([[undefined, []]]);

    for (const command of commands) {
      const guilds = Array.isArray(this.options.development) ? this.options.development : command.getGuilds() ?? [undefined];

      for (const guildId of guilds) {
        const visitedCommands = commandsByGuildMap.get(guildId) ?? [];
        commandsByGuildMap.set(guildId, visitedCommands.concat(command));
      }
    }

    try {
      if (!this._applicationId) {
        this._applicationId = (await api.users.getCurrent()).id;
      }
    } catch (error) {
      this.logger.error('Failed to fetch application id for command registration', error);
      return;
    }

    this.logger.log(`Started updating application commands for ${commandsByGuildMap.size - 1} guilds and global commands`);
    for (const [guild, commands] of commandsByGuildMap) {
      if (guild !== undefined) {
        this.logger.debug(`Updating application commands for guild ${guild}, ${commands.length} commands registered`);
        await api.applicationCommands.bulkOverwriteGuildCommands(
          this._applicationId,
          guild,
          commands.map(command => command.toJSON())
        );
      } else {
        this.logger.log(`Updating global commands, ${commands.length} global commands registered`);
        await api.applicationCommands.bulkOverwriteGlobalCommands(
          this._applicationId,
          commands.map(command => command.toJSON())
        );
      }
    }
    this.logger.log('Successfully updated application commands');
  }
}
