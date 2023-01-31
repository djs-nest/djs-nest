import { DjsExecutionContext, isModalSubmit, ModalInteractionContext } from '@djs-nest/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ModalParam: (param?: string) => ParameterDecorator = createParamDecorator((data, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<ModalInteractionContext>();
  const discovery = djsContext.getDiscovery();

  if (!discovery.isModal() || !isModalSubmit(interaction)) return null;

  const match = discovery.matcher(interaction.data.custom_id);

  if (!match) return null;

  return data ? match.params[data] : match.params;
});
