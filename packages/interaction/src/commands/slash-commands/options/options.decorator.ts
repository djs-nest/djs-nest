import { DJS_OPTIONS_METADATA, DjsExecutionContext, isChatInputCommand, SlashCommandInteractionContext } from '@djs-nest/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Options = createParamDecorator(
  (_, context: ExecutionContext) => {
    const djsContext = DjsExecutionContext.create(context);

    const [interaction, options] = djsContext.getContext<SlashCommandInteractionContext>();
    const discovery = djsContext.getDiscovery();

    if (!discovery.isSlashCommand()) return null;

    if (!isChatInputCommand(interaction) || !interaction.data.options) return null;

    return Object.entries(discovery.getRawOptions()).reduce((acc, [parameter, option]) => {
      acc[parameter] = options[option.resolver].call(options, option.name, !!option.required);
      return acc;
    }, {});
  },
  [
    (target, propertyKey, parameterIndex) => {
      const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
      let { prototype } = paramTypes[parameterIndex];

      const options = {};

      do {
        Object.getOwnPropertyNames(prototype)
          .map(name => [name, Reflect.getMetadata(DJS_OPTIONS_METADATA, prototype, name)])
          .filter(([, meta]) => !!meta)
          .forEach(([name, meta]) => (options[name] ??= meta));
      } while ((prototype = Reflect.getPrototypeOf(prototype)) && prototype !== Object.prototype);

      Reflect.defineMetadata(DJS_OPTIONS_METADATA, options, target[propertyKey]);
    }
  ]
);

export const DjsOptions = Options;
