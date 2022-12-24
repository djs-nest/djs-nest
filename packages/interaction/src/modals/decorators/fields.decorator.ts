import { DjsExecutionContext, isModalSubmit, ModalInteractionContext } from '@djs-nest/common';
import { createParamDecorator } from '@nestjs/common';

export const ModalFields: (customId?: string) => ParameterDecorator = createParamDecorator((customId, context) => {
  const djsContext = DjsExecutionContext.create(context);
  const [interaction, options] = djsContext.getContext<ModalInteractionContext>();

  if (!isModalSubmit(interaction)) return null;

  if (customId) {
    return options.getField(customId);
  }

  return options.getFields();
});

export const ModalField: (customId: string) => ParameterDecorator = createParamDecorator((customId, context) => {
  const djsContext = DjsExecutionContext.create(context);
  const [interaction, options] = djsContext.getContext<ModalInteractionContext>();

  if (!isModalSubmit(interaction)) return null;

  return options.getField(customId, false);
});
