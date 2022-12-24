import { APIApplicationCommandRoleOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const RoleOption = createOptionDecorator<APIApplicationCommandRoleOption>(ApplicationCommandOptionType.Role, 'getRole');
