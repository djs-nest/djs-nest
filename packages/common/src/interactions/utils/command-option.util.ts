import { APIApplicationCommandInteractionDataBasicOption } from '@discordjs/core';

export function isFocusableOption(
  option: APIApplicationCommandInteractionDataBasicOption
): option is APIApplicationCommandInteractionDataBasicOption & { focused?: boolean } {
  return option['focused'] !== undefined;
}
