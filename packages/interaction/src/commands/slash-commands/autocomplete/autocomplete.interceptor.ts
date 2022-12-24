import { APIApplicationCommandAutocompleteInteraction } from '@discordjs/core';
import { AutocompleteInteractionContext, CommandOptionsResolver, DjsExecutionContext, isAutocomplete } from '@djs-nest/common';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export abstract class AutocompleteInterceptor implements NestInterceptor {
  abstract transformOptions(
    interaction: APIApplicationCommandAutocompleteInteraction,
    hoisted: CommandOptionsResolver
  ): void | Promise<void>;

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const djsContext = DjsExecutionContext.create(context);

    const [interaction, options] = djsContext.getContext<AutocompleteInteractionContext>();
    const discovery = djsContext.getDiscovery();

    if (!discovery.isSlashCommand() || !isAutocomplete(interaction)) return next.handle();

    return of(this.transformOptions(interaction, options));
  }
}
