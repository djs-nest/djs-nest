import { ContextType, ExecutionContext } from '@nestjs/common';
import { DjsArgumentsHost } from './djs-arguments-host';

export type DjsContextType = 'djs' | ContextType;

export class DjsExecutionContext extends DjsArgumentsHost {
  static create(context: ExecutionContext): DjsExecutionContext {
    const type = context.getType();
    const djsContext = new DjsExecutionContext(context.getArgs(), context.getClass(), context.getHandler());
    djsContext.setType(type);
    return djsContext;
  }
}
