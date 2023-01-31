import {
  AsyncModuleConfig,
  createConfigurableDynamicRootModule,
  createModuleConfigProvider,
  DJS_REST_MODULE_OPTIONS
} from '@djs-nest/common';
import { DynamicModule } from '@nestjs/common';
import { DjsApiProvider } from './djs-api.provider';
import { DjsRestModuleOptions } from './djs-rest-options.interface';
import { DjsRestProvider } from './djs-rest.provider';

const RestModuleProperties = {
  providers: [DjsRestProvider, DjsApiProvider],
  exports: [DjsRestProvider, DjsApiProvider]
};

export class DjsRestModule extends createConfigurableDynamicRootModule() {
  static forRootAsync(asyncModuleConfig: AsyncModuleConfig<DjsRestModuleOptions>): DynamicModule {
    const dynamicModule = {
      module: DjsRestModule,
      exports: RestModuleProperties.exports,
      providers: [...createModuleConfigProvider(DJS_REST_MODULE_OPTIONS, asyncModuleConfig), ...RestModuleProperties.providers]
    };

    DjsRestModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }

  static forRoot(moduleConfig: DjsRestModuleOptions): DynamicModule {
    const dynamicModule: DynamicModule = {
      module: DjsRestModule,
      exports: RestModuleProperties.exports,
      providers: [
        {
          provide: DJS_REST_MODULE_OPTIONS,
          useValue: moduleConfig
        },
        ...RestModuleProperties.providers
      ]
    };

    DjsRestModule.moduleSubject.next(dynamicModule);

    return dynamicModule;
  }
}
