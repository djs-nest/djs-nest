import { APIMessageComponentInteraction, ComponentType } from '@discordjs/core';
import { match } from 'path-to-regexp';
import { DjsBaseDiscovery } from './djs-base.discovery';

export interface MessageComponentMeta {
  type: Exclude<ComponentType, ComponentType.ActionRow | ComponentType.TextInput>;
  customId: string;
}

export class MessageComponentDiscovery extends DjsBaseDiscovery<MessageComponentMeta> {
  readonly matcher = match([this.meta.type, this.meta.customId].join('_'));

  static componentName = (type: MessageComponentMeta['type'], customId: MessageComponentMeta['customId']): string => {
    return [type, customId].join('_');
  };

  getType() {
    return this.meta.type;
  }

  getCustomId() {
    return this.meta.customId;
  }

  getComponentName() {
    return MessageComponentDiscovery.componentName(this.getType(), this.getCustomId());
  }

  execute(interaction: APIMessageComponentInteraction): Promise<any> {
    return super.execute([interaction]);
  }

  isMessageComponent(): this is MessageComponentDiscovery {
    return true;
  }

  override toJSON(): Record<string, any> {
    return this.meta;
  }
}
