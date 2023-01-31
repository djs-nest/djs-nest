import { DJS_MESSAGE_COMPONENT_METADATA, MessageComponentDiscovery, MessageComponentMeta } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const MessageComponent = (options: MessageComponentMeta) =>
  SetMetadata<string, MessageComponentDiscovery>(DJS_MESSAGE_COMPONENT_METADATA, new MessageComponentDiscovery(options));
