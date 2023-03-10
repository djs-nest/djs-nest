import { APIApplicationCommandUserOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const MemberUserOption = createOptionDecorator<APIApplicationCommandUserOption>(ApplicationCommandOptionType.User, 'getMemberUser');
