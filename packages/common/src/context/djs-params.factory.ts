import { ParamData } from '@nestjs/common';
import { ParamsFactory } from '@nestjs/core/helpers/external-context-creator';
import { DjsBaseDiscovery } from '../discovery';
import { DjsParamType } from './djs-paramtype.enum';

export class DjsParamsFactory implements ParamsFactory {
  exchangeKeyForValue(type: number, _data: ParamData, args: [Array<any>, DjsBaseDiscovery]): any {
    if (!args) return null;

    switch (type as DjsParamType) {
      case DjsParamType.CONTEXT:
        return args[0];
      default:
        return null;
    }
  }
}
