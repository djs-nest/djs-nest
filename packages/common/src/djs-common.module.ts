import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ExplorerService } from './explorer.service';

@Module({
  imports: [DiscoveryModule],
  providers: [ExplorerService],
  exports: [ExplorerService]
})
export class DjsCommonModule {}
