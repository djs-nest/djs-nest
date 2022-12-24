<div align="center">
    <h1>djs-nest</h1>
    A collection of modules for creating <a href="https://discord.com/">Discord</a> bots using <a href="https://nestjs.com">NestJS</a>, based on <a href="https://github.com/discordjs/discord.js/tree/main/packages/core">@discordjs/core</a>, <a href="https://github.com/discordjs/discord.js/tree/main/packages/rest">@discordjs/rest</a>,  <a href="https://github.com/discordjs/discord.js/tree/main/packages/ws">@discordjs/ws</a>
    <br/>
    <p>
        <a href="https://discord.gg/djs"><img src="https://img.shields.io/discord/222078108977594368?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/core"><img src="https://img.shields.io/npm/v/@djs-nest/core.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/core"><img src="https://img.shields.io/npm/dt/@djs-nest/core.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?precision=2" alt="Code coverage" /></a>
	</p>
    <a href="https://djs-nest.github.com/djs-nest">Documentation✨</a> &emsp; <a href="https://github.com/djs-nest/djs-nest">Source code ⌨️</a> &emsp; <a href="https://github.com/djs-nest/djs-nest/tree/main/apps/samples">Examples 🛠️</a> &emsp; <a href="https://discord.gg/mcBYvMTnwP">Community 💬</a>
</div>

---

## What is djs-nest?

djs-nest is a collection of modules for creating Discord bots using NestJS, utilizing the wrapper packages provided by
Discord.js. Flexibility has been placed at the forefront to let you build bots the way you want.

djs-nest provides 5 modules:

- [@djs-nest/core][djs-core] - The core module, provides the `DjsCoreModule`, `DjsClient`, and `WebSocketManager` for
  handling gateway events.
- [@djs-nest/interaction][djs-interaction] - The interaction module, provides the `DjsInteractionModule`
  and `InteractionService` for creating and handling application commands.
- [@djs-nest/rest][djs-rest] - The rest module, provides the `DjsRestModule` and `DjsAPI` for interacting with the
  Discord REST API.
- [@djs-nest/middleware][djs-middleware] - The middleware module, provides the `InteractionMiddleware` for handling
  application commands.
- [@djs-nest/common][djs-common] - The common module. Is used internally by the core, interaction, and rest modules.

## Why djs-nest?

djs-nest makes building Discord bots as microservices using NestJS a breeze. The individual modules allow you to
implement the features you want and not the ones you don't.

## Why another Discord library?

Discord.js recently released new packages for interacting with the Discord API which are great at breaking Discord.js
into smaller features. djs-nest aims to provide a more microservice and NestJS friendly way of interacting with them.

I needed a library that would allow me to build Discord bots as microservices using NestJS. I couldn't find one that
satisfied my requirements:

- To handle the application commands via an Interactions Endpoint Url setup in the Discord Developer Portal
- Use [@discordjs/rest][discordjs-rest] and [@discordjs/core][discordjs-core] packages

---

## Usages

### [@djs-nest/core][djs-core]

Core enables you to handle gateway events from Discord. Core can be used without any other modules. It does
use `@djs-nest/rest` internally to create the `DjsClient` and `WebSocketManager`.

You can optionally register the module with an externally configured `DjsRestModule`. Otherwise, the module will
create a new `DjsRestModule` with the default configuration and token provided to `DjsCoreModule`.

### [@djs-nest/interaction][djs-interaction]

Interaction enables you to create and handle application commands. Interaction can be used without any other modules.  
Note: Without the `DjsRestModule`, it will **not** auto register application commands.

### [@djs-nest/rest][djs-rest]

Rest enables you to interact with the Discord REST API. Rest can be used without any other modules.

### [@djs-nest/middleware][djs-middleware]

Middleware enables you to handle application commands through NestJS controllers. Middleware can be used without any
other modules.

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested. If you find a bug, please
include a minimal reproduction.

If you wish to contribute to djs-nest, please read the [contributing guidelines][contributing].

## Links

- [Documentation][documentation]
- [Contributing][contributing]
- [Commit Convention][commit]
- [GitHub][source]
- [npm][npm]

[documentation]: https://djs-nest.github.com/djs-nest
[source]: https://github.com/djs-nest/djs-nest/tree/main
[djs-common]: https://github.com/djs-nest/djs-nest/tree/main/packages/common
[djs-core]: https://github.com/djs-nest/djs-nest/tree/main/packages/core
[djs-interaction]: https://github.com/djs-nest/djs-nest/tree/main/packages/interaction
[djs-middleware]: https://github.com/djs-nest/djs-nest/tree/main/packages/middleware
[djs-rest]: https://github.com/djs-nest/djs-nest/tree/main/packages/rest
[npm]: https://www.npmjs.com/package/@djs-nest/core
[commits]: https://github.com/djs-nest/djs-nest/blob/main/.github/CONTRIBUTING.md
[contributing]: https://github.com/djs-nest/djs-nest/blob/main/.github/CONTRIBUTING.md
[commit]: https://github.com/djs-nest/djs-nest/blob/main/.github/COMMIT_CONVENTION.md
[discordjs-rest]: https://github.com/discordjs/discord.js/tree/main/packages/rest
[discordjs-core]: https://github.com/discordjs/discord.js/tree/main/packages/core
