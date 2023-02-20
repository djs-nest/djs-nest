import { APIApplicationCommandOptionBase, ApplicationCommandOptionType } from '@discordjs/core';
import { DJS_OPTIONS_METADATA, OptionMeta } from '@djs-nest/common';

export type BaseOptionMeta = APIApplicationCommandOptionBase<any>;

export type OptionMetaOmit<T extends BaseOptionMeta> = Omit<T, 'type'>;

export function createOptionDecorator<T extends BaseOptionMeta>(type: ApplicationCommandOptionType, resolver: OptionMeta['resolver']) {
  return (data: OptionMetaOmit<T>): PropertyDecorator => {
    return (target: any, propertyKey: string | symbol) => {
      Reflect.defineProperty(target, propertyKey, {
        value: undefined,
        writable: true,
        configurable: true
      });

      const meta: OptionMeta = {
        ...data,
        type,
        resolver
      };

      Reflect.defineMetadata(DJS_OPTIONS_METADATA, meta, target, propertyKey);
    };
  };
}
