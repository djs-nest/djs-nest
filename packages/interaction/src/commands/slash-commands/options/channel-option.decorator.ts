import { APIApplicationCommandChannelOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const ChannelOption = createOptionDecorator<APIApplicationCommandChannelOption>(ApplicationCommandOptionType.Channel, 'getChannel');
