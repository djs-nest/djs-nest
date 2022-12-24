import { APIModalSubmitInteraction } from '@discordjs/core';
import { match } from 'path-to-regexp';
import { ModalFieldsResolver } from '../interactions/modals/modal-fields-resolver';
import { DjsBaseDiscovery } from './djs-base.discovery';

export interface ModalMeta {
  customId: string;
}

export class ModalDiscovery extends DjsBaseDiscovery<ModalMeta> {
  readonly matcher = match(this.meta.customId);

  getCustomId() {
    return this.meta.customId;
  }

  execute(interaction: APIModalSubmitInteraction): Promise<any> {
    return super.execute([interaction, new ModalFieldsResolver(interaction)]);
  }

  isModal(): this is ModalDiscovery {
    return true;
  }

  override toJSON(): Record<string, any> {
    return this.meta;
  }
}
