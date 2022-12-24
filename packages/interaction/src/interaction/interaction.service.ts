import { APIInteraction } from '@discordjs/core';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InteractionHandlerService } from './interaction-handler.interface';

@Injectable()
export class InteractionService implements OnModuleInit {
  private interactionHandlers: InteractionHandlerService[] = [];

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit(): void {
    this.interactionHandlers = this.discoveryService
      .getProviders()
      .filter(provider => provider.instance instanceof InteractionHandlerService)
      .map(provider => provider.instance);
  }

  handleInteraction(interaction: APIInteraction): Promise<void> {
    this.interactionHandlers.forEach(handler => handler.handleInteraction(interaction));
    return;
  }
}
