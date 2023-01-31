import { Provider } from '@nestjs/common';
import { DjsService } from '../djs.service';
import { DjsClient } from './djs-client';

export const DjsClientProvider: Provider<DjsClient> = {
  provide: DjsClient,
  useFactory: (djsService: DjsService) => {
    return djsService.client;
  },
  inject: [DjsService]
};
