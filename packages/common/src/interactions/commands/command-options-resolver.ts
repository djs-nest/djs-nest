import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteractionDataAttachmentOption,
  APIApplicationCommandInteractionDataBasicOption,
  APIApplicationCommandInteractionDataBooleanOption,
  APIApplicationCommandInteractionDataChannelOption,
  APIApplicationCommandInteractionDataIntegerOption,
  APIApplicationCommandInteractionDataMentionableOption,
  APIApplicationCommandInteractionDataNumberOption,
  APIApplicationCommandInteractionDataRoleOption,
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandInteractionDataUserOption,
  APIAttachment,
  APIChatInputApplicationCommandInteraction,
  APIInteractionDataResolved,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
  ApplicationCommandOptionType,
  ChannelType
} from '@discordjs/core';
import { isFocusableOption } from '../utils';
import { MemberUser } from './member-user.interface';
import { OptionsResolvers } from './options-resolvers.interface';

export class CommandOptionsResolver implements OptionsResolvers {
  private readonly hoistedOptions: APIApplicationCommandInteractionDataBasicOption[];
  private readonly resolved: APIInteractionDataResolved | undefined;
  private readonly group;
  private readonly subcommand;

  constructor(interaction: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction) {
    this.resolved = interaction.data.resolved;
    let hoistedOptions = interaction.data.options;

    if (!hoistedOptions) {
      hoistedOptions = [];
    }

    // Hoist subcommand group if present
    if (hoistedOptions[0]?.type === ApplicationCommandOptionType.SubcommandGroup) {
      this.group = hoistedOptions[0].name;
      hoistedOptions = hoistedOptions[0].options ?? [];
    }
    // Hoist subcommand if present
    if (hoistedOptions[0]?.type === ApplicationCommandOptionType.Subcommand) {
      this.subcommand = hoistedOptions[0].name;
      hoistedOptions = hoistedOptions[0].options ?? [];
    }

    this.hoistedOptions = hoistedOptions as APIApplicationCommandInteractionDataBasicOption[];
  }

  /**
   * Gets an option by its name.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?APIApplicationCommandInteractionDataBasicOption} The option, if found.
   */
  get(name: string, required = false): APIApplicationCommandInteractionDataBasicOption | null {
    const option = this.hoistedOptions.find(opt => opt.name === name);
    if (!option) {
      if (required) {
        throw new Error(`Option Not Found: ${name}`);
      }
      return null;
    }
    return option;
  }

  /**
   * Gets an option by name and property and checks its type.
   * @param {string} name The name of the option.
   * @param {ApplicationCommandOptionType[]} allowedTypes The allowed types of the option.
   * @param {boolean} required Whether to throw an error if the option is not found.
   * @returns {?APIApplicationCommandInteractionDataBasicOption} The option, if found.
   * @private
   */
  private getTypedOption(
    name: string,
    allowedTypes: ApplicationCommandOptionType[],
    required: boolean
  ): APIApplicationCommandInteractionDataBasicOption | null {
    const option = this.get(name, required);
    if (!option) {
      return null;
    } else if (!allowedTypes.includes(option.type)) {
      throw new Error(`Option Type Mismatch: ${name}, option type ${option.type}, allowed types ${allowedTypes.join(', ')}`);
    } else if (required && (option['value'] === null || typeof option['value'] === 'undefined')) {
      throw new Error(`Option Empty: ${name}, ${option.type}`);
    }
    return option;
  }

  /**
   * Gets the selected subcommand.
   * @param {boolean} [required=true] Whether to throw an error if there is no subcommand.
   * @returns {?string} The name of the selected subcommand, or null if not set and not required.
   */
  getSubcommand(required = true) {
    if (required && !this.subcommand) {
      throw new Error('No Subcommand');
    }
    return this.subcommand;
  }

  /**
   * Gets the selected subcommand group.
   * @param {boolean} [required=false] Whether to throw an error if there is no subcommand group.
   * @returns {?string} The name of the selected subcommand group, or null if not set and not required.
   */
  getSubcommandGroup(required = false) {
    if (required && !this.group) {
      throw new Error('No Subcommand Group');
    }
    return this.group;
  }

  /**
   * Gets a number option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getNumber(name: string, required = false): number | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Number],
      required
    ) as APIApplicationCommandInteractionDataNumberOption;
    return typeof option?.value === 'number' ? option.value : null;
  }

  /**
   * Gets an integer option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?number} The value of the option, or null if not set and not required.
   */
  getInteger(name: string, required = false): number | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Integer],
      required
    ) as APIApplicationCommandInteractionDataIntegerOption;
    return option?.value ?? null;
  }

  /**
   * Gets a string option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?string} The value of the option, or null if not set and not required.
   */
  getString(name: string, required = false): string | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.String],
      required
    ) as APIApplicationCommandInteractionDataStringOption;
    return option?.value ?? null;
  }

  /**
   * Gets a boolean option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?boolean} The value of the option, or null if not set and not required.
   */
  getBoolean(name: string, required = false): boolean | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Boolean],
      required
    ) as APIApplicationCommandInteractionDataBooleanOption;
    return option?.value ?? null;
  }

  /**
   * Gets a mentionable option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?(APIInteractionDataResolvedGuildMember | APIUser | APIRole)}
   * The value of the option, or null if not set and not required.
   */
  getMentionable(name: string, required = false): APIInteractionDataResolvedGuildMember | APIUser | APIRole | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Mentionable],
      required
    ) as APIApplicationCommandInteractionDataMentionableOption;
    return !option?.value
      ? null
      : this.resolved?.members[option.value] ?? this.resolved?.users[option.value] ?? this.resolved?.roles[option.value] ?? null;
  }

  /**
   * Gets a member option.
   * @param {string} name The name of the option.
   * @returns {?APIInteractionDataResolvedGuildMember}
   * The value of the option, or null if the user is not present in the guild or the option is not set.
   */
  getMember(name: string): APIInteractionDataResolvedGuildMember | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.User, ApplicationCommandOptionType.Mentionable],
      false
    ) as APIApplicationCommandInteractionDataUserOption;
    return !option?.value ? null : this.resolved?.members[option.value] ?? null;
  }

  /**
   * Gets a user option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?APIUser} The value of the option, or null if not set and not required.
   */
  getUser(name: string, required = false): APIUser | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.User, ApplicationCommandOptionType.Mentionable],
      required
    ) as APIApplicationCommandInteractionDataUserOption;
    return !option?.value ? null : this.resolved?.users[option.value] ?? null;
  }

  /**
   * Gets a member and user option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?APIUser} The value of the option, or null if not set and not required.
   */
  getMemberUser(name: string, required = false): MemberUser | null {
    const member = this.getMember(name);
    const user = this.getUser(name, required);
    return !member && !user ? null : { member, user };
  }

  /**
   * Gets a role option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?APIRole} The value of the option, or null if not set and not required.
   */
  getRole(name: string, required = false): APIRole | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Role, ApplicationCommandOptionType.Mentionable],
      required
    ) as APIApplicationCommandInteractionDataRoleOption;
    return !option?.value ? null : this.resolved?.roles[option.value] ?? null;
  }

  /**
   * Gets a channel option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @param {ChannelType[]} [channelTypes=[]] The allowed types of channels. If empty, all channel types are allowed.
   * @returns {?APIInteractionDataResolvedChannel}
   * The value of the option, or null if not set and not required.
   */
  getChannel(name: string, required = false, channelTypes: ChannelType[] = []): APIInteractionDataResolvedChannel | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Channel],
      required
    ) as APIApplicationCommandInteractionDataChannelOption;
    const channel = !option?.value ? null : this.resolved?.channels[option.value] ?? null;

    if (channel && channelTypes.length > 0 && !channelTypes.includes(channel.type)) {
      throw new Error(`Option Invalid ChannelType: ${name}, ${channel.type}, ${channelTypes.join(', ')}`);
    }

    return channel;
  }

  /**
   * Gets an attachment option.
   * @param {string} name The name of the option.
   * @param {boolean} [required=false] Whether to throw an error if the option is not found.
   * @returns {?APIAttachment} The value of the option, or null if not set and not required.
   */
  getAttachment(name: string, required = false): APIAttachment | null {
    const option = this.getTypedOption(
      name,
      [ApplicationCommandOptionType.Attachment],
      required
    ) as APIApplicationCommandInteractionDataAttachmentOption;
    return !option?.value ? null : this.resolved?.attachments[option.value] ?? null;
  }

  /**
   * Gets the focused option.
   * @param {boolean} [getFull=true] Whether to get the full option object
   * @returns {string|APIApplicationCommandInteractionDataBasicOption}
   * The value of the option, or the whole option if getFull is true
   */
  getFocused(getFull: true): APIApplicationCommandInteractionDataBasicOption;
  getFocused(getFull?: false): string | number | boolean;
  getFocused(getFull = true): APIApplicationCommandInteractionDataBasicOption | string | number | boolean {
    const focusedOption = this.hoistedOptions.find(option => isFocusableOption(option) && option.focused);
    if (!focusedOption) {
      throw new Error('AutocompleteInteraction no focused option');
    }
    return getFull ? focusedOption : focusedOption.value;
  }
}
