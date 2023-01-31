import { WithIntrinsicProps } from '@discordjs/core';
import { DJS_EVENTS_METADATA, EventsDiscovery, ExplorerService } from '@djs-nest/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DjsService } from '../djs.service';

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly djsService: DjsService, private readonly explorerService: ExplorerService<EventsDiscovery>) {}

  onModuleInit() {
    return this.explorerService.explore(DJS_EVENTS_METADATA).forEach(event => {
      this.logger.log(`Subscribe to event(${event.getType()}): ${event.getEvent()}`);
      this.djsService.client[event.getType()](event.getEvent(), (...args: [WithIntrinsicProps<any>]) => {
        event.execute([args[0].data, { api: args[0].api, shardId: args[0].shardId }]);
      });
    });
  }
}
