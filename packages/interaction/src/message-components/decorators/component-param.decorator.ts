import { ButtonInteractionContext, DjsExecutionContext, isMessageComponent, MessageComponentDiscovery } from '@djs-nest/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ComponentParam: (customId?: string) => ParameterDecorator = createParamDecorator((customId, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<ButtonInteractionContext>();
  const discovery = djsContext.getDiscovery();

  if (!discovery.isMessageComponent() || !isMessageComponent(interaction)) return null;

  const match = discovery.matcher(MessageComponentDiscovery.componentName(interaction.data.component_type, interaction.data.custom_id));

  if (!match) return null;

  return customId ? match.params[customId] : match.params;
});
