import {
  APIApplicationCommandInteractionDataBasicOption,
  APIAttachment,
  APIInteractionDataResolvedChannel,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  APIUser,
  ChannelType
} from '@discordjs/core';
import { MemberUser } from './member-user.interface';

export interface OptionsResolvers {
  getNumber(name: string, required?: boolean): number | null;

  getInteger(name: string, required?: boolean): number | null;

  getString(name: string, required?: boolean): string | null;

  getBoolean(name: string, required?: boolean): boolean | null;

  getMentionable(name: string, required?: boolean): APIInteractionDataResolvedGuildMember | APIUser | APIRole | null;

  getMember(name: string): APIInteractionDataResolvedGuildMember | null;

  getUser(name: string, required?: boolean): APIUser | null;

  getMemberUser(name: string, required?: boolean): MemberUser | null;

  getRole(name: string, required?: boolean): APIRole | null;

  getChannel(name: string, required?: boolean, channelTypes?: ChannelType[]): APIInteractionDataResolvedChannel | null;

  getAttachment(name: string, required?: boolean): APIAttachment | null;

  getFocused(getFull: boolean): APIApplicationCommandInteractionDataBasicOption | string | null;
}
