import { MappedEvents } from '@discordjs/core';
import { DjsBaseDiscovery } from './djs-base.discovery';

export interface EventMeta {
  type: 'once' | 'on';
  event: keyof MappedEvents;
}

export class EventsDiscovery extends DjsBaseDiscovery<EventMeta> {
  getType(): 'once' | 'on' {
    return this.meta.type;
  }

  getEvent(): keyof MappedEvents {
    return this.meta.event;
  }

  isEvent(): this is EventsDiscovery {
    return true;
  }

  override toJSON(): Record<string, any> {
    return this.meta;
  }
}
