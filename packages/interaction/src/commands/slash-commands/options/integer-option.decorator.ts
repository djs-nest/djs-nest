import { APIApplicationCommandIntegerOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const IntegerOption = createOptionDecorator<APIApplicationCommandIntegerOption>(ApplicationCommandOptionType.Integer, 'getInteger');
