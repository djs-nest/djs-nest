import { APIApplicationCommandNumberOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const NumberOption = createOptionDecorator<APIApplicationCommandNumberOption>(ApplicationCommandOptionType.Number, 'getNumber');
