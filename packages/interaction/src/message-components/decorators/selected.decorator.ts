import { APIInteractionDataResolvedChannel, APIInteractionDataResolvedGuildMember, APIRole, APIUser } from '@discordjs/core';
import {
  ChannelSelectInteractionContext,
  DjsExecutionContext,
  isChannelSelectMenu,
  isMentionableSelectMenu,
  isRoleSelectMenu,
  isStringSelectMenu,
  isUserSelectMenu,
  RoleSelectInteractionContext,
  StringSelectInteractionContext,
  UserSelectInteractionContext
} from '@djs-nest/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SelectedStrings = createParamDecorator((_, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<StringSelectInteractionContext>();

  return isStringSelectMenu(interaction) ? interaction.data.values : [];
});

export const SelectedChannels = createParamDecorator((_, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<ChannelSelectInteractionContext>();

  if (isChannelSelectMenu(interaction)) {
    return interaction.data.resolved.channels ? Object.values(interaction.data.resolved.channels) : [];
  }

  return [];
});
export type ISelectedChannels = APIInteractionDataResolvedChannel[];

export const SelectedUsers = createParamDecorator((_, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<UserSelectInteractionContext>();

  if (isUserSelectMenu(interaction) || isMentionableSelectMenu(interaction)) {
    return interaction.data.resolved.users ? Object.values(interaction.data.resolved.users) : [];
  }

  return [];
});
export type ISelectedUsers = APIUser[];

export const SelectedMembers = createParamDecorator((_, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<UserSelectInteractionContext>();

  if (isUserSelectMenu(interaction) || isMentionableSelectMenu(interaction)) {
    return interaction.data.resolved.members ? Object.values(interaction.data.resolved.members) : [];
  }

  return [];
});
export type ISelectedMembers = APIInteractionDataResolvedGuildMember[];

export const SelectedRoles = createParamDecorator((_, ctx: ExecutionContext) => {
  const djsContext = DjsExecutionContext.create(ctx);
  const [interaction] = djsContext.getContext<RoleSelectInteractionContext>();

  if (isRoleSelectMenu(interaction) || isMentionableSelectMenu(interaction)) {
    return interaction.data.resolved.roles ? Object.values(interaction.data.resolved.roles) : [];
  }

  return [];
});
export type ISelectedRoles = APIRole[];
