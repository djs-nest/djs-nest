<div align="center">
    <h1>@djs-nest/rest</h1>
    Rest module which provides a simple module for initializing the <a href="https://github.com/discordjs/discord.js/tree/main/packages/rest">@discordjs/rest</a> REST client and API from <a href="https://github.com/discordjs/discord.js/tree/main/packages/core">@discordjs/core</a>.
    <br/>
    <p>
        <a href="https://discord.gg/ZTapEzyD6G"><img src="https://img.shields.io/discord/1077051842615312496?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/rest"><img src="https://img.shields.io/npm/v/@djs-nest/rest.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/rest"><img src="https://img.shields.io/npm/dt/@djs-nest/rest.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?flag=rest" alt="Code coverage" /></a>
	</p>
</div>

---

## Installation

```bash
npm install @djs-nest/rest @discordjs/rest @discordjs/core
yarn install @djs-nest/rest @discordjs/rest @discordjs/core
pnpm install @djs-nest/rest @discordjs/rest @discordjs/core
```

## Example usage

```ts
import { DjsRestModule } from '@djs-nest/rest';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DjsRestModule.forRoot({
      token: process.env['DISCORD_BOT_TOKEN']
    })
  ],
  providers: []
})
export class MainModule {}
```

### Using the API

```ts
import { DjsApi } from '@djs-nest/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  constructor(private readonly djsApi: DjsApi) {}

  getBotInfo() {
    return this.djsApi.users.getCurrent();
  }
}
```

### Using REST directly

```ts
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10'; // optional but recommended, to use the types for routes
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  constructor(private readonly rest: REST) {}

  getBotInfo() {
    return this.rest.get(Routes.user('@me'));
  }
}
```

### Other Features

View the [documentation][documentation] for all features and examples

[documentation]: https://djs-nest.github.io/djs-nest/
