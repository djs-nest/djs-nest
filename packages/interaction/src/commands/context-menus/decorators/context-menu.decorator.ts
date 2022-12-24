import { ContextMenuDiscovery, ContextMenuMeta, DJS_CONTEXT_MENU_METADATA } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const ContextMenu = (options: ContextMenuMeta) =>
  SetMetadata<string, ContextMenuDiscovery>(DJS_CONTEXT_MENU_METADATA, new ContextMenuDiscovery(options));
