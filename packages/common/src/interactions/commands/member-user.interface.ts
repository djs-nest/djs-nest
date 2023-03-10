import { APIInteractionDataResolvedGuildMember, APIUser } from '@discordjs/core';

export interface MemberUser {
  member: APIInteractionDataResolvedGuildMember | null;
  user: APIUser | null;
}
