import { APIInteraction } from '@discordjs/core';
import {
  DJS_MESSAGE_COMPONENT_METADATA,
  ExplorerService,
  isMessageComponent,
  MessageComponentDiscovery,
  MessageComponentMeta
} from '@djs-nest/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InteractionHandlerService } from '../interaction';

@Injectable()
export class MessageComponentsService extends InteractionHandlerService implements OnModuleInit {
  private readonly components = new Map<string, MessageComponentDiscovery>();

  constructor(private readonly explorerService: ExplorerService<MessageComponentDiscovery>) {
    super();
  }

  onModuleInit() {
    return this.explorerService.explore(DJS_MESSAGE_COMPONENT_METADATA).forEach(component => this.add(component));
  }

  handleInteraction(interaction: APIInteraction): Promise<any> {
    if (!isMessageComponent(interaction)) return;

    const name = MessageComponentDiscovery.componentName(interaction.data.component_type, interaction.data.custom_id);

    for (const component of this.components.values()) {
      if (component.matcher(name)) {
        return component.execute(interaction);
      }
    }
  }

  add(component: MessageComponentDiscovery) {
    this.components.set(component.getComponentName(), component);
  }

  remove(type: MessageComponentMeta['type'], customId: MessageComponentMeta['customId']) {
    this.components.delete(MessageComponentDiscovery.componentName(type, customId));
  }
}
