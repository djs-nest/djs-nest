import {
  AsyncModuleConfig,
  createConfigurableDynamicRootModule,
  createModuleConfigProvider,
  DJS_CORE_MODULE_OPTIONS,
  DjsCommonModule
} from '@djs-nest/common';
import { DjsRestModule } from '@djs-nest/rest';
import { DynamicModule } from '@nestjs/common';
import { DjsClientProvider } from './client';
import { DjsCoreModuleOptions } from './djs-core-options.interface';
import { DjsService } from './djs.service';
import { EventsService } from './events';
import { DjsWsProvider } from './ws';

const CoreModuleProperties = {
  imports: [DjsCommonModule, DjsRestModule.deferred()],
  providers: [DjsService, DjsClientProvider, DjsWsProvider, EventsService],
  exports: [DjsClientProvider, DjsWsProvider]
};

export class DjsCoreModule extends createConfigurableDynamicRootModule() {
  static forRootAsync(asyncModuleConfig: AsyncModuleConfig<DjsCoreModuleOptions>): DynamicModule {
    const dynamicModule = {
      module: DjsCoreModule,
      imports: [...CoreModuleProperties.imports, DjsRestModule.forRootAsync(asyncModuleConfig)],
      exports: CoreModuleProperties.exports,
      providers: [...createModuleConfigProvider(DJS_CORE_MODULE_OPTIONS, asyncModuleConfig), ...CoreModuleProperties.providers]
    };

    DjsCoreModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }

  static forRoot(moduleConfig: DjsCoreModuleOptions): DynamicModule {
    const dynamicModule: DynamicModule = {
      module: DjsCoreModule,
      imports: [...CoreModuleProperties.imports, DjsRestModule.forRoot(moduleConfig)],
      exports: CoreModuleProperties.exports,
      providers: [
        {
          provide: DJS_CORE_MODULE_OPTIONS,
          useValue: moduleConfig
        },
        ...CoreModuleProperties.providers
      ]
    };

    DjsCoreModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }

  static forExistingRestAsync(asyncModuleConfig: AsyncModuleConfig<Exclude<DjsCoreModuleOptions, 'rest'>>): DynamicModule {
    const dynamicModule = {
      module: DjsCoreModule,
      imports: [...CoreModuleProperties.imports],
      exports: CoreModuleProperties.exports,
      providers: [...createModuleConfigProvider(DJS_CORE_MODULE_OPTIONS, asyncModuleConfig), ...CoreModuleProperties.providers]
    };

    DjsCoreModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }

  static forExistingRest(moduleConfig: Exclude<DjsCoreModuleOptions, 'rest'>): DynamicModule {
    const dynamicModule: DynamicModule = {
      module: DjsCoreModule,
      imports: [...CoreModuleProperties.imports],
      exports: CoreModuleProperties.exports,
      providers: [
        {
          provide: DJS_CORE_MODULE_OPTIONS,
          useValue: moduleConfig
        },
        ...CoreModuleProperties.providers
      ]
    };

    DjsCoreModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }
}
