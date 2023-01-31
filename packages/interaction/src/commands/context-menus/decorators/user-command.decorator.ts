import { ApplicationCommandType } from '@discordjs/core';
import { ContextMenuMeta } from '@djs-nest/common';
import { ContextMenu } from './context-menu.decorator';

export type UserCommandOptions = Omit<ContextMenuMeta, 'type'>;

export const UserCommand = (options: UserCommandOptions) => ContextMenu({ type: ApplicationCommandType.User, ...options });
