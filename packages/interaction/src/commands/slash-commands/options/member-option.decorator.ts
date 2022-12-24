import { APIApplicationCommandUserOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const MemberOption = createOptionDecorator<APIApplicationCommandUserOption>(ApplicationCommandOptionType.User, 'getMember');
