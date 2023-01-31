import { APIContextMenuInteraction, ApplicationCommandType, Snowflake } from '@discordjs/core';
import { BaseCommandMeta } from '../interactions';
import { CommandDiscovery } from './command.discovery';

export type ContextMenuMeta = BaseCommandMeta & {
  type: ApplicationCommandType.User | ApplicationCommandType.Message;
  guilds?: Snowflake[];
};

export class ContextMenuDiscovery extends CommandDiscovery<ContextMenuMeta> {
  getType() {
    return this.meta.type;
  }

  isContextMenu(): this is ContextMenuDiscovery {
    return true;
  }

  execute(interaction: APIContextMenuInteraction): Promise<any> {
    return super.execute([interaction]);
  }

  override toJSON() {
    return { ...this.meta, guilds: undefined };
  }
}
