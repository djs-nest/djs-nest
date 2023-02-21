<div align="center">
    <h1>@djs-nest/middleware</h1>
    Simple middleware for NestJS that allows you to handle Discord interactions via an API request.
    <br/>
    <p>
        <a href="https://discord.gg/ZTapEzyD6G"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/middleware"><img src="https://img.shields.io/npm/v/@djs-nest/middleware.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/middleware"><img src="https://img.shields.io/npm/dt/@djs-nest/middleware.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?flag=middleware" alt="Code coverage" /></a>
	</p>
</div>

---

## Installation

```bash
npm install @djs-nest/middleware
yarn install @djs-nest/middleware
pnpm install @djs-nest/middleware
```

## Example usage

Setup controller:

```ts
import { Body, Controller, Post } from '@nestjs/common';

// import { APIInteraction } from '@discordjs/core'; // optionally import base interaction type if you want to use it from discord.js

@Controller('interaction')
export class InteractionController {
  @Post('register')
  interactionPost(@Body() interaction: any /*APIInteraction*/): any {
    // Handle interaction here
  }
}
```

Setup middleware:

- InteractionMiddleware requires the public key of your application, which can be found in the Discord Developer Portal
  under your application's General Information page.

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { InteractionMiddleware } from '@djs-nest/middleware';

@Module({
  controllers: [InteractionController]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(new InteractionMiddleware(process.env['DISCORD_PUBLIC_KEY'])).forRoutes('interaction');
  }
}
```

### Other Features

View the [documentation][documentation] for all features and examples

[documentation]: https://djs-nest.github.io/djs-nest/
