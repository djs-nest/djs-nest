import { Snowflake } from '@discordjs/core';
import { BaseCommandMeta } from '../interactions';
import { DjsBaseDiscovery } from './djs-base.discovery';

export abstract class CommandDiscovery<T extends BaseCommandMeta & { guilds?: Snowflake[] } = BaseCommandMeta> extends DjsBaseDiscovery<T> {
  getName() {
    return this.meta.name;
  }

  getGuilds(): Snowflake[] {
    return this.meta.guilds;
  }

  toJSON() {
    return {
      ...this.meta,
      guilds: undefined
    };
  }
}
