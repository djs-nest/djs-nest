import { APIApplicationCommandMentionableOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const MentionableOption = createOptionDecorator<APIApplicationCommandMentionableOption>(
  ApplicationCommandOptionType.Mentionable,
  'getMentionable'
);

export const MentionableValue = createOptionDecorator<APIApplicationCommandMentionableOption>(
  ApplicationCommandOptionType.Mentionable,
  'getMentionable',
  true
);
