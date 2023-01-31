<div align="center">
    <h1>@djs-nest/core</h1>
    Core module which provides functionality for handling discord events.
    <br/>
    <p>
        <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/core"><img src="https://img.shields.io/npm/v/@djs-nest/core.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/core"><img src="https://img.shields.io/npm/dt/@djs-nest/core.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/test.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?precision=2" alt="Code coverage" /></a>
	</p>
</div>

---

## Installation

```bash
npm install @djs-nest/core @discordjs/core @discordjs/ws
yarn install @djs-nest/core @discordjs/core @discordjs/ws
pnpm install @djs-nest/core @discordjs/core @discordjs/ws
```

## Example usage

### `forRoot` or `forRootAsync`

most common, autoconfigured DjsRestModule  
Use this setup when you need both Discord Events and the REST client initialized and autoconfigured.

```ts
import { DjsCoreModule } from '@djs-nest/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DjsCoreModule.forRoot({
      token: process.env['DISCORD_BOT_TOKEN'],
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildEmojisAndStickers
    })
  ],
  providers: []
})
export class MainModule {}
```

### `forExistingRest` or `forExistingRestAsync`

when externally configuring DjsRestModule  
Use one of these options when you have externally configured the REST client.

```ts
import { DjsRestModule } from '@djs-nest/rest';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DjsRestModule.forRoot({
      token: process.env['DISCORD_BOT_TOKEN']
    }),
    DjsCoreModule.forExistingRest({
      token: process.env['DISCORD_BOT_TOKEN'],
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildEmojisAndStickers
    })
  ],
  providers: []
})
export class MainModule {}
```

### Listening to events

```ts
import { GatewayDispatchEvents } from '@discordjs/core';
import { ContextOf, DjsContext } from '@djs-nest/common';
import { On, Once } from '@djs-nest/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  @On(GatewayDispatchEvents.MessageCreate)
  onMessage(@DjsContext() [message]: ContextOf<GatewayDispatchEvents.MessageCreate>) {
    console.log('Message!');
  }

  @Once(GatewayDispatchEvents.Ready)
  onceReady(@DjsContext() [ready]: ContextOf<GatewayDispatchEvents.Ready>) {
    console.log('Ready!');
  }
}
```

### Other Features

View the [documentation][documentation] for all features and examples

[documentation]: https://djs-nest.github.io/djs-nest/
