import { APIApplicationCommandAttachmentOption, ApplicationCommandOptionType } from '@discordjs/core';
import { createOptionDecorator } from './option.util';

export const AttachmentOption = createOptionDecorator<APIApplicationCommandAttachmentOption>(
  ApplicationCommandOptionType.Attachment,
  'getAttachment'
);
