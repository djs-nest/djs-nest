import { APIInteraction } from '@discordjs/core';

export abstract class InteractionHandlerService {
  abstract handleInteraction(interaction: APIInteraction): Promise<any>;
}
