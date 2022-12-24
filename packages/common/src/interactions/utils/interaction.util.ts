import {
  APIApplicationCommandAutocompleteInteraction,
  APIApplicationCommandInteraction,
  APIInteraction,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
  InteractionType
} from '@discordjs/core';

export function isApplicationCommand(interaction: APIInteraction): interaction is APIApplicationCommandInteraction {
  return interaction.type === InteractionType.ApplicationCommand;
}

export function isAutocomplete(interaction: APIInteraction): interaction is APIApplicationCommandAutocompleteInteraction {
  return interaction.type === InteractionType.ApplicationCommandAutocomplete;
}

export function isModalSubmit(interaction: APIInteraction): interaction is APIModalSubmitInteraction {
  return interaction.type === InteractionType.ModalSubmit;
}

export function isMessageComponent(interaction: APIInteraction): interaction is APIMessageComponentInteraction {
  return interaction.type === InteractionType.MessageComponent;
}
