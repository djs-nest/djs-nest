import { Snowflake } from '@discordjs/core';

export interface DjsInteractionModuleOptions {
  development?: Snowflake[] | false;
  /**
   * Set to true to skip registering the commands on startup. Will also be skipped if DjsApi is not available.
   * @default false
   * @type {boolean}
   */
  skipRegistration?: boolean;
}
