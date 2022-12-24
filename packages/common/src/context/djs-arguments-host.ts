import { MappedEvents } from '@discordjs/core';
import { ArgumentsHost } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { DjsBaseDiscovery } from '../discovery';
import { ContextOf } from './djs-context.interface';
import { DjsContextType } from './djs-execution-context';

export class DjsArgumentsHost extends ExecutionContextHost {
  static create(context: ArgumentsHost): DjsArgumentsHost {
    const type = context.getType();
    const djsContext = new DjsArgumentsHost(context.getArgs());
    djsContext.setType(type);
    return djsContext;
  }

  getType<TContext extends string = DjsContextType>(): TContext {
    return super.getType();
  }

  getContext<T extends keyof MappedEvents>(): ContextOf<T>;
  getContext<T>(): T;
  getContext<T extends keyof MappedEvents>(): ContextOf<T> {
    return this.getArgByIndex(0);
  }

  getDiscovery(): DjsBaseDiscovery {
    return this.getArgByIndex(1);
  }
}
