<div align="center">
    <h1>@djs-nest/common</h1>
    Common module which provides the explorer service.
    <br/>
    <p>
        <a href="https://discord.gg/ZTapEzyD6G"><img src="https://img.shields.io/discord/1077051842615312496?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/common"><img src="https://img.shields.io/npm/v/@djs-nest/common.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/@djs-nest/common"><img src="https://img.shields.io/npm/dt/@djs-nest/common.svg?maxAge=3600" alt="npm downloads" /></a>
		<a href="https://github.com/djs-nest/djs-nest/actions"><img src="https://github.com/djs-nest/djs-nest/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
		<a href="https://codecov.io/gh/djs-nest/djs-nest" ><img src="https://codecov.io/gh/djs-nest/djs-nest/branch/main/graph/badge.svg?flag=common" alt="Code coverage" /></a>
	</p>
</div>

---

## Common

The `@djs-nest/common` package is used internally by the other packages and provides the `DjsExplorerService` which is
used to discover the commands and events.  
Typically, you don't need to install this package yourself.

## Installation

```bash
npm install @djs-nest/common
yarn install @djs-nest/common
pnpm install @djs-nest/common
```

## Example usage

```ts
import { DjsCommonModule } from '@djs-nest/common/src';
import { DjsCoreModule } from '@djs-nest/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [DjsCommonModule]
})
export class MainModule {}
```

### Other Features

View the [documentation][documentation] for all features and examples

[documentation]: https://djs-nest.github.io/djs-nest/
