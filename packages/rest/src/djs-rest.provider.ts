import { REST } from '@discordjs/rest';
import { DJS_REST_MODULE_OPTIONS } from '@djs-nest/common';
import { Provider } from '@nestjs/common';
import { DjsRestModuleOptions } from './djs-rest-options.interface';

export const DjsRestProvider: Provider<REST> = {
  provide: REST,
  useFactory: (options: DjsRestModuleOptions) => new REST(options.rest).setToken(options.token),
  inject: [DJS_REST_MODULE_OPTIONS]
};
