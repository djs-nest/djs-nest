import { APIInteraction } from '@discordjs/core';
import {
  CommandDiscovery,
  ContextMenuDiscovery,
  ContextMenuMeta,
  DJS_CONTEXT_MENU_METADATA,
  ExplorerService,
  isContextMenuCommand
} from '@djs-nest/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InteractionHandlerService } from '../../interaction';

@Injectable()
export class ContextMenusService extends InteractionHandlerService implements OnModuleInit {
  private readonly contextMenus = new Map<string, ContextMenuDiscovery>();

  constructor(private readonly explorerService: ExplorerService<ContextMenuDiscovery>) {
    super();
  }

  onModuleInit() {
    return this.explorerService.explore(DJS_CONTEXT_MENU_METADATA).forEach(contextMenu => this.add(contextMenu));
  }

  handleInteraction(interaction: APIInteraction): Promise<any> {
    if (!isContextMenuCommand(interaction)) return;

    return this.contextMenus.get(interaction.data.type.toString().concat(':', interaction.data.name))?.execute(interaction);
  }

  getCommands(): CommandDiscovery[] {
    return [...this.contextMenus.values()];
  }

  add(contextMenu: ContextMenuDiscovery): void {
    this.contextMenus.set(contextMenu.getType().toString().concat(':', contextMenu.getName()), contextMenu);
  }

  remove(type: ContextMenuMeta['type'], name: ContextMenuMeta['name']): boolean {
    return this.contextMenus.delete(type.toString().concat(':', name));
  }
}
