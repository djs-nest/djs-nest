import { DJS_EVENTS_METADATA, EventMeta, EventsDiscovery } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const Listener = (options: EventMeta) => SetMetadata<string, EventsDiscovery>(DJS_EVENTS_METADATA, new EventsDiscovery(options));
