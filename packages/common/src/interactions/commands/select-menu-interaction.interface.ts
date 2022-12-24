import {
  APIBaseInteraction,
  APIMessageChannelSelectInteractionData,
  APIMessageMentionableSelectInteractionData,
  APIMessageRoleSelectInteractionData,
  APIMessageStringSelectInteractionData,
  APIMessageUserSelectInteractionData,
  InteractionType
} from '@discordjs/core';

export type SelectMenuInteraction<Data> = APIBaseInteraction<InteractionType.MessageComponent, Data> &
  Required<Pick<APIBaseInteraction<InteractionType.MessageComponent, Data>, 'channel_id' | 'data' | 'app_permissions' | 'message'>>;

export type APIMessageComponentStringSelectMenuInteraction = SelectMenuInteraction<APIMessageStringSelectInteractionData>;
export type APIMessageComponentUserSelectMenuInteraction = SelectMenuInteraction<APIMessageUserSelectInteractionData>;
export type APIMessageComponentRoleSelectMenuInteraction = SelectMenuInteraction<APIMessageRoleSelectInteractionData>;
export type APIMessageComponentChannelSelectMenuInteraction = SelectMenuInteraction<APIMessageChannelSelectInteractionData>;
export type APIMessageComponentMentionableSelectMenuInteraction = SelectMenuInteraction<APIMessageMentionableSelectInteractionData>;
