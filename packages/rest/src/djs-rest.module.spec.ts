import { REST } from '@discordjs/rest';
import { DjsApi } from '@djs-nest/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DjsRestModule } from './djs-rest.module';

describe('DjsRestModule', () => {
  describe.each([
    {
      method: 'forRoot',
      imports: [
        DjsRestModule.forRoot({
          token: 'token'
        })
      ]
    },
    {
      method: 'forRootAsync',
      imports: [
        DjsRestModule.forRootAsync({
          useFactory: () => ({
            token: 'token'
          })
        })
      ]
    }
  ])('when configured $method', ({ imports }) => {
    let api: DjsApi;
    let rest: REST;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports
      }).compile();

      api = module.get<DjsApi>(DjsApi);
      rest = module.get<REST>(REST);
    });

    describe('DjsApi', () => {
      it('should be provided', () => {
        expect(api).toBeDefined();
      });
    });

    describe('REST', () => {
      it('should be provided', () => {
        expect(rest).toBeDefined();
      });
    });
  });
});
