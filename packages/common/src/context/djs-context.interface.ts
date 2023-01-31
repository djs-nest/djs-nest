import {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIMessageApplicationCommandInteraction,
  APIMessageComponentButtonInteraction,
  APIModalSubmitInteraction,
  APIUserApplicationCommandInteraction,
  IntrinsicProps,
  MappedEvents
} from '@discordjs/core';
import {
  APIMessageComponentChannelSelectMenuInteraction,
  APIMessageComponentMentionableSelectMenuInteraction,
  APIMessageComponentRoleSelectMenuInteraction,
  APIMessageComponentStringSelectMenuInteraction,
  APIMessageComponentUserSelectMenuInteraction,
  CommandOptionsResolver,
  ModalFieldsResolver
} from '../interactions';

export type ContextOf<K extends keyof MappedEvents> = [MappedEvents[K][0]['data'], IntrinsicProps];

export type AutocompleteInteractionContext = [APIApplicationCommandAutocompleteInteraction, CommandOptionsResolver];

export type SlashCommandInteractionContext = [APIChatInputApplicationCommandInteraction, CommandOptionsResolver];

export type UserCommandInteractionContext = [APIUserApplicationCommandInteraction];

export type MessageCommandInteractionContext = [APIMessageApplicationCommandInteraction];

export type ModalInteractionContext = [APIModalSubmitInteraction, ModalFieldsResolver];

export type ButtonInteractionContext = [APIMessageComponentButtonInteraction];

export type StringSelectInteractionContext = [APIMessageComponentStringSelectMenuInteraction];

export type UserSelectInteractionContext = [APIMessageComponentUserSelectMenuInteraction];

export type RoleSelectInteractionContext = [APIMessageComponentRoleSelectMenuInteraction];

export type ChannelSelectInteractionContext = [APIMessageComponentChannelSelectMenuInteraction];

export type MentionableSelectInteractionContext = [APIMessageComponentMentionableSelectMenuInteraction];
