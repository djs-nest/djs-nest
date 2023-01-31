import {
  DjsExecutionContext,
  isMessageContextMenuCommand,
  isUserContextMenuCommand,
  MessageCommandInteractionContext,
  UserCommandInteractionContext
} from '@djs-nest/common';
import { createParamDecorator } from '@nestjs/common';

export const TargetMessage: () => ParameterDecorator = createParamDecorator((_, context) => {
  const djsContext = DjsExecutionContext.create(context);
  const [interaction] = djsContext.getContext<MessageCommandInteractionContext>();

  if (!isMessageContextMenuCommand(interaction)) return null;

  return interaction.data.resolved?.messages[interaction.data.target_id];
});

export const TargetUser: () => ParameterDecorator = createParamDecorator((_, context) => {
  const djsContext = DjsExecutionContext.create(context);
  const [interaction] = djsContext.getContext<UserCommandInteractionContext>();

  if (!isUserContextMenuCommand(interaction)) return null;

  return interaction.data.resolved?.users[interaction.data.target_id];
});

export const TargetMember: () => ParameterDecorator = createParamDecorator((_, context) => {
  const djsContext = DjsExecutionContext.create(context);
  const [interaction] = djsContext.getContext<UserCommandInteractionContext>();

  if (!isUserContextMenuCommand(interaction)) return null;

  return interaction.data.resolved?.members[interaction.data.target_id];
});
