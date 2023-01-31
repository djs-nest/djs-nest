import { APIInteraction } from '@discordjs/core';
import { DJS_MODAL_METADATA, ExplorerService, isModalSubmit, ModalDiscovery } from '@djs-nest/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InteractionHandlerService } from '../interaction';

@Injectable()
export class ModalsService extends InteractionHandlerService implements OnModuleInit {
  private readonly modals = new Map<string, ModalDiscovery>();

  constructor(private readonly explorerService: ExplorerService<ModalDiscovery>) {
    super();
  }

  onModuleInit() {
    return this.explorerService.explore(DJS_MODAL_METADATA).forEach(modal => this.add(modal));
  }

  handleInteraction(interaction: APIInteraction): Promise<any> {
    if (!isModalSubmit(interaction)) return;

    const name = interaction.data.custom_id;

    for (const modal of this.modals.values()) {
      if (modal.matcher(name)) {
        return modal.execute(interaction);
      }
    }
  }

  add(modal: ModalDiscovery) {
    this.modals.set(modal.getCustomId(), modal);
  }

  remove(customId: string) {
    this.modals.delete(customId);
  }
}
