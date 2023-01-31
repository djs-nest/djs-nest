import {
  AsyncModuleConfig,
  createConfigurableDynamicRootModule,
  createModuleConfigProvider,
  DJS_INTERACTION_MODULE_OPTIONS,
  DjsCommonModule
} from '@djs-nest/common';
import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CommandsService, ContextMenusService, SlashCommandsService } from './commands';
import { DjsInteractionModuleOptions } from './djs-interaction-options.interface';
import { InteractionService } from './interaction';
import { MessageComponentsService } from './message-components';
import { ModalsService } from './modals';

const InteractionModuleProperties = {
  imports: [DiscoveryModule, DjsCommonModule],
  providers: [CommandsService, SlashCommandsService, ContextMenusService, MessageComponentsService, ModalsService, InteractionService],
  exports: [CommandsService, SlashCommandsService, ContextMenusService, MessageComponentsService, ModalsService, InteractionService]
};

@Module({
  imports: InteractionModuleProperties.imports,
  exports: InteractionModuleProperties.exports,
  providers: [
    {
      provide: DJS_INTERACTION_MODULE_OPTIONS,
      useValue: {}
    },
    ...InteractionModuleProperties.providers
  ]
})
export class DjsInteractionModule extends createConfigurableDynamicRootModule() {
  static forRootAsync(asyncModuleConfig: AsyncModuleConfig<DjsInteractionModuleOptions>): DynamicModule {
    const dynamicModule = {
      module: DjsInteractionModule,
      imports: InteractionModuleProperties.imports,
      exports: InteractionModuleProperties.exports,
      providers: [
        ...createModuleConfigProvider(DJS_INTERACTION_MODULE_OPTIONS, asyncModuleConfig),
        ...InteractionModuleProperties.providers
      ]
    };

    DjsInteractionModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }

  static forRoot(moduleConfig: DjsInteractionModuleOptions = {}): DynamicModule {
    const dynamicModule: DynamicModule = {
      module: DjsInteractionModule,
      imports: InteractionModuleProperties.imports,
      exports: InteractionModuleProperties.exports,
      providers: [
        {
          provide: DJS_INTERACTION_MODULE_OPTIONS,
          useValue: moduleConfig
        },
        ...InteractionModuleProperties.providers
      ]
    };

    DjsInteractionModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }
}
