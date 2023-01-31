import { APIApplicationCommandOptionBase, ApplicationCommandOptionType } from '@discordjs/core';
import { DJS_OPTIONS_METADATA, OptionMeta } from '@djs-nest/common';

export type BaseOptionMeta = APIApplicationCommandOptionBase<any>;

export function createOptionDecorator<T extends BaseOptionMeta>(type: ApplicationCommandOptionType, resolver: OptionMeta['resolver']) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (data: Omit<T, 'type'>): PropertyDecorator => {
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
