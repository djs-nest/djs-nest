import { APIInteraction, APIMessageComponentButtonInteraction, ComponentType } from '@discordjs/core';
import {
  APIMessageComponentChannelSelectMenuInteraction,
  APIMessageComponentMentionableSelectMenuInteraction,
  APIMessageComponentRoleSelectMenuInteraction,
  APIMessageComponentStringSelectMenuInteraction,
  APIMessageComponentUserSelectMenuInteraction
} from '../commands';
import { isMessageComponent } from './interaction.util';

export function isButton(interaction: APIInteraction): interaction is APIMessageComponentButtonInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.Button;
}

export function isStringSelectMenu(interaction: APIInteraction): interaction is APIMessageComponentStringSelectMenuInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.StringSelect;
}

export function isUserSelectMenu(interaction: APIInteraction): interaction is APIMessageComponentUserSelectMenuInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.UserSelect;
}

export function isRoleSelectMenu(interaction: APIInteraction): interaction is APIMessageComponentRoleSelectMenuInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.RoleSelect;
}

export function isChannelSelectMenu(interaction: APIInteraction): interaction is APIMessageComponentChannelSelectMenuInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.ChannelSelect;
}

export function isMentionableSelectMenu(interaction: APIInteraction): interaction is APIMessageComponentMentionableSelectMenuInteraction {
  return isMessageComponent(interaction) && interaction.data.component_type === ComponentType.MentionableSelect;
}
