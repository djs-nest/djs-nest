import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { DjsRestModule } from '@djs-nest/rest';
import { Test, TestingModule } from '@nestjs/testing';
import { DjsClient } from './client';
import { DjsCoreModule } from './djs-core.module';

describe('DjsCoreModule', () => {
  describe.each([
    {
      method: 'forRoot',
      imports: [
        DjsCoreModule.forRoot({
          token: 'token',
          intents: 0
        })
      ]
    },
    {
      method: 'forRootAsync',
      imports: [
        DjsCoreModule.forRootAsync({
          useFactory: () => ({
            token: 'token',
            intents: 0
          })
        })
      ]
    },
    {
      method: 'forExistingRest',
      imports: [
        DjsRestModule.forRoot({ token: '' }),
        DjsCoreModule.forExistingRest({
          token: 'token',
          intents: 0
        })
      ]
    },
    {
      method: 'forExistingRestAsync',
      imports: [
        DjsRestModule.forRoot({ token: '' }),
        DjsCoreModule.forExistingRestAsync({
          useFactory: () => ({
            token: 'token',
            intents: 0
          })
        })
      ]
    }
  ])('when configured $method', ({ imports }) => {
    let webSocketManager: WebSocketManager;
    let djsClient: DjsClient;
    let rest: REST;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports
      }).compile();

      webSocketManager = module.get<WebSocketManager>(WebSocketManager);
      djsClient = module.get<DjsClient>(DjsClient);
      rest = module.get<REST>(REST);
    });

    it('should provide DjsClient', () => {
      expect(djsClient).toBeDefined();
    });

    it('should provide WebSocketManager', () => {
      expect(webSocketManager).toBeDefined();
    });

    it('should import DjsRestModule', () => {
      expect(rest).toBeDefined();
    });
  });
});
