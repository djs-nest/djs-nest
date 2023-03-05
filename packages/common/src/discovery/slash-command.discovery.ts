import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandOptionBase,
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
  Snowflake
} from '@discordjs/core';
import { DJS_OPTIONS_METADATA } from '../djs.constants';
import { BaseCommandMeta, BaseRootCommandMeta, CommandOptionsResolver, OptionsResolvers } from '../interactions';
import { CommandDiscovery } from './command.discovery';

function permissionsResolvableToBit(permission?: BaseRootCommandMeta['default_member_permissions']): bigint | undefined {
  if (!permission) return undefined;

  if (typeof permission === 'bigint') {
    return permission;
  }
  if (Array.isArray(permission)) {
    return permission.map(p => permissionsResolvableToBit(p)).reduce((prev, p) => prev | p, BigInt(0));
  }
  if (typeof permission === 'string') {
    if (typeof PermissionFlagsBits[permission] !== 'undefined') {
      return PermissionFlagsBits[permission];
    }
    if (!isNaN(permission as any)) {
      return BigInt(permission);
    }
  }
  return BigInt(0);
}

export interface SlashCommandMeta extends BaseCommandMeta {
  type?: ApplicationCommandType.ChatInput | ApplicationCommandOptionType.SubcommandGroup | ApplicationCommandOptionType.Subcommand;
  guilds?: Snowflake[];
}

export interface OptionMeta extends APIApplicationCommandOptionBase<any> {
  resolver?: keyof OptionsResolvers;
  skipRegistration?: boolean;
}

export class SlashCommandDiscovery extends CommandDiscovery<SlashCommandMeta> {
  private readonly subcommands = new Map<string, SlashCommandDiscovery>();

  getDescription() {
    return this.meta.description;
  }

  setCommand(command: SlashCommandDiscovery) {
    this.subcommands.set(command.getName(), command);
  }

  getRawOptions(): Record<string, OptionMeta> {
    return this.reflector.get(DJS_OPTIONS_METADATA, this.getHandler()) ?? {};
  }

  getOptions() {
    if (this.subcommands.size >= 1) {
      return [...this.subcommands.values()].map(subcommand => subcommand.toJSON());
    }

    return Object.values(this.getRawOptions())
      .filter(option => !option.skipRegistration)
      .map(option => {
        return { ...option, resolver: undefined };
      });
  }

  execute(interaction: APIChatInputApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction, depth = 1): any {
    const options = new CommandOptionsResolver(interaction);
    if (this.subcommands.size >= 1) {
      const commandName = depth === 2 ? options.getSubcommand(true) : options.getSubcommandGroup(false) ?? options.getSubcommand(true);

      return this.subcommands.get(commandName)?.execute(interaction, depth + 1);
    }

    return super.execute([interaction, options]);
  }

  isSlashCommand(): this is SlashCommandDiscovery {
    return true;
  }

  override toJSON() {
    const memberPermissions: bigint | undefined = permissionsResolvableToBit((this.meta as BaseRootCommandMeta).default_member_permissions);

    return {
      ...this.meta,
      default_member_permissions: memberPermissions?.toString(),
      options: this.getOptions()
    };
  }
}
