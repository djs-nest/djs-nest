import { ApplicationCommandType } from '@discordjs/core';
import { ContextMenuMeta } from '@djs-nest/common';
import { ContextMenu } from './context-menu.decorator';

export type MessageCommandOptions = Omit<ContextMenuMeta, 'type'>;

export const MessageCommand = (options: MessageCommandOptions) => ContextMenu({ type: ApplicationCommandType.Message, ...options });
