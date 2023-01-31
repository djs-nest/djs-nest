import { APIApplicationCommandBooleanOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const BooleanOption = createOptionDecorator<APIApplicationCommandBooleanOption>(ApplicationCommandOptionType.Boolean, 'getBoolean');
