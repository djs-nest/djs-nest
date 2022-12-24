import { DjsParamType } from '../djs-paramtype.enum';
import { createDjsParamDecorator } from './params.util';

export const Context = createDjsParamDecorator(DjsParamType.CONTEXT);

export const DjsContext = Context;
