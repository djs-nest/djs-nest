import { APIApplicationCommandUserOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const UserOption = createOptionDecorator<APIApplicationCommandUserOption>(ApplicationCommandOptionType.User, 'getUser');

export const UserValue = createOptionDecorator<APIApplicationCommandUserOption>(ApplicationCommandOptionType.User, 'getUser', true);
