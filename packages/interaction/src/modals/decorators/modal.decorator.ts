import { DJS_MODAL_METADATA, ModalDiscovery } from '@djs-nest/common';
import { SetMetadata } from '@nestjs/common';

export const Modal = (customId: string): MethodDecorator =>
  SetMetadata<string, ModalDiscovery>(DJS_MODAL_METADATA, new ModalDiscovery({ customId }));
