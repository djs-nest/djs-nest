import { ComponentType } from '@discordjs/core';
import { MessageComponent } from './message-component.decorator';

export const Button = (customId: string) => MessageComponent({ customId, type: ComponentType.Button });
