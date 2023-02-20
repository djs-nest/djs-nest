<div align="center">
    <h1>@djs-nest/interaction</h1>
    Module for initializing the <a href="https://github.com/discordjs/discord.js/tree/main/packages/rest">@discordjs/rest</a> client. Providing decorators to handle define and register commands.
    <br/>
    <p>
        <a href="https://discord.gg/ZTapEzyD6G"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/interaction"><img src="https://img.shields.io/npm/v/@djs-nest/interaction.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/interaction"><img src="https://img.shields.io/npm/dt/@djs-nest/interaction.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?flag=interaction" alt="Code coverage" /></a>
	</p>
</div>

---

## Installation

```bash
npm install @djs-nest/interaction @discordjs/core
yarn install @djs-nest/interaction @discordjs/core
pnpm install @djs-nest/interaction @discordjs/core
```

## Example usage

```ts
import { DjsInteractionModule } from '@djs-nest/interaction';
import { Module } from '@nestjs/common';

@Module({
  imports: [DjsInteractionModule, DjsRestModule.forRoot({ token: 'token' })],
  providers: []
})
export class MainModule {}
```

**Note**: The `DjsRestModule` is optional. However, without `DjsRestModule`, you will have to register application
commands yourself.

### Slash Commands

Single slash commands can be created using `@SlashCommand`

```ts
export class CommandService {
  @SlashCommand({ name: 'ping', description: 'ping command' })
  onPing(@DjsContext() [interaction]: SlashCommandInteractionContext) {
    console.log('executed command: /ping');
  }
}
```

Groups of commands can also be created using `createCommandGroupDecorator`

```ts
const AdminCommands = createCommandGroupDecorator({ name: 'admin', description: 'admin commands' });

@AdminCommands()
class SlashCommandsGroupService {
  @Subcommand({ name: 'clear', description: 'clear chat command' })
  onAdminClear(@DjsContext() [interaction]: SlashCommandInteractionContext) {
    console.log('executed command: /admin clear');
  }
}
```

Subgroups can be created using existing parent command decorators

```ts
const AdminCommands = createCommandGroupDecorator({ name: 'admin', description: 'admin commands' });
// for readibility you can create a decorator for the sub group
const AdminChannelsCommands = () => AdminCommands({ name: 'channels', description: 'admin channel management' });

// or just inline, @AdminCommands({ name: 'channels', description: 'admin channel management' })

@AdminChannelsCommands()
class SlashCommandsSubGroupService {
  @Subcommand({ name: 'remove', description: 'remove channel command' })
  onChannelRemove(@DjsContext() [interaction]: SlashCommandInteractionContext) {
    console.log('executed command: /admin channels remove');
  }
}
```

### Other Features

View the [documentation][documentation] for all features and examples

[documentation]: https://djs-nest.github.io/djs-nest/
