import {
  APIChatInputApplicationCommandInteraction,
  APIContextMenuInteraction,
  APIInteraction,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType
} from '@discordjs/core';
import { isApplicationCommand } from './interaction.util';

export function isChatInputCommand(interaction: APIInteraction): interaction is APIChatInputApplicationCommandInteraction {
  return isApplicationCommand(interaction) && interaction.data.type === ApplicationCommandType.ChatInput;
}

export function isContextMenuCommand(interaction: APIInteraction): interaction is APIContextMenuInteraction {
  return isApplicationCommand(interaction) && [ApplicationCommandType.User, ApplicationCommandType.Message].includes(interaction.data.type);
}

export function isUserContextMenuCommand(interaction: APIInteraction): interaction is APIUserApplicationCommandInteraction {
  return isApplicationCommand(interaction) && interaction.data.type === ApplicationCommandType.User;
}

export function isMessageContextMenuCommand(interaction: APIInteraction): interaction is APIMessageApplicationCommandInteraction {
  return isApplicationCommand(interaction) && interaction.data.type === ApplicationCommandType.Message;
}
