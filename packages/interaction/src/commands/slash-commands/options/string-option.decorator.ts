import { APIApplicationCommandStringOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const StringOption = createOptionDecorator<APIApplicationCommandStringOption>(ApplicationCommandOptionType.String, 'getString');
