import { LocalizationMap, PermissionFlagsBits } from '@discordjs/core';

type BitFieldResolvable<T extends string, N extends number | bigint> = T | N | `${bigint}`;

export interface BaseCommandMeta {
  /**
   * <a href="/developers/docs/interactions/application-commands#application-command-object-application-command-naming">Name of command</a>, 1-32 characters
   */
  name: string;
  /**
   * Localization dictionary for `name` field. Values follow the same restrictions as `name`
   */
  name_localizations?: LocalizationMap;
  /**
   * Description for CHAT_INPUT commands, 1-100 characters.
   */
  description: string;
  /**
   * Localization dictionary for `description` field. Values follow the same restrictions as description
   */
  description_localizations?: LocalizationMap;
}

export interface BaseRootCommandMeta extends BaseCommandMeta {
  /**
   * Indicates whether the command is available in DMs with the app, only for globally-scoped commands. By default, commands are visible.
   */
  dm_permission?: boolean;
  /**
   * Set of <a href="/developers/docs/topics/permissions">permissions</a> represented as a bit set
   * @see PermissionFlagsBits
   *
   * Valid uses are:
   * - `PermissionFlagsBits.ManageChannels` - bitwise value
   * - `'ManageChannels'` - string literal
   * - `PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles` - bitwise OR
   */
  default_member_permissions?: BitFieldResolvable<keyof typeof PermissionFlagsBits, bigint>;
  /**
   * Indicates whether the command is <a href="https://discord.com/developers/docs/interactions/application-commands#agerestricted-commands">age-restricted</a>, defaults to false
   */
  nsfw?: boolean;
}
