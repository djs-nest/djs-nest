import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { DjsApi } from '@djs-nest/common';
import { Provider } from '@nestjs/common';

export const DjsApiProvider: Provider<DjsApi> = {
  provide: DjsApi,
  useFactory: (rest: REST) => new API(rest),
  inject: [REST]
};
