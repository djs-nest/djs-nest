import { RESTOptions } from '@discordjs/rest';

export interface DjsRestModuleOptions {
  token: string;
  rest?: Partial<RESTOptions>;
}
