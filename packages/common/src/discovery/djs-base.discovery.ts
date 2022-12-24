import { Reflector } from '@nestjs/core';
import { ContextMenuDiscovery } from './context-menu.discovery';
import { EventsDiscovery } from './events.discovery';
import { MessageComponentDiscovery } from './message-component.discovery';
import { ModalDiscovery } from './modal.discovery';
import { SlashCommandDiscovery } from './slash-command.discovery';

interface DiscoveredItem {
  class: any;
  handler?: (...args: any[]) => any;
}

export abstract class DjsBaseDiscovery<T = any> {
  protected readonly reflector = new Reflector();

  protected discovery: DiscoveredItem;

  protected contextCallback: (...args: any[]) => Promise<any>;

  constructor(protected readonly meta: T) {}

  getClass() {
    return this.discovery.class;
  }

  getHandler() {
    return this.discovery.handler;
  }

  setDiscoveryMeta(meta: DiscoveredItem) {
    this.discovery ??= meta;
  }

  setContextCallback(fn: (...args: any[]) => Promise<any>) {
    this.contextCallback ??= fn;
  }

  execute(context: any = []): Promise<any> {
    return this.contextCallback(context, this);
  }

  isContextMenu(): this is ContextMenuDiscovery {
    return false;
  }

  isSlashCommand(): this is SlashCommandDiscovery {
    return false;
  }

  isMessageComponent(): this is MessageComponentDiscovery {
    return false;
  }

  isEvent(): this is EventsDiscovery {
    return false;
  }

  isModal(): this is ModalDiscovery {
    return false;
  }

  abstract toJSON(): Record<string, any>;
}
