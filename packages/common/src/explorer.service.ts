import { Injectable } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { ParamMetadata } from '@nestjs/core/helpers/interfaces';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { DjsContextType, DjsParamsFactory } from './context';
import { DjsBaseDiscovery } from './discovery';

@Injectable()
export class ExplorerService<T extends DjsBaseDiscovery> extends Reflector {
  private readonly djsParamsFactory = new DjsParamsFactory();

  private readonly wrappers;

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly metadataScanner: MetadataScanner
  ) {
    super();
    this.wrappers = this.discoveryService.getProviders().filter(wrapper => {
      const { instance } = wrapper;
      const prototype = instance ? Object.getPrototypeOf(instance) : null;

      return instance && prototype && wrapper.isDependencyTreeStatic();
    });
  }

  explore(metadataKey: string): T[] {
    return this.flatMap(wrapper => this.filterProperties(wrapper, metadataKey));
  }

  private flatMap(callback: (wrapper: InstanceWrapper) => T[]) {
    return this.wrappers.flatMap(callback).filter(Boolean);
  }

  private filterProperties({ instance }: InstanceWrapper, metadataKey: string): T[] {
    const prototype = Object.getPrototypeOf(instance);

    return this.metadataScanner.scanFromPrototype(instance, prototype, methodName => {
      const item = this.get<T>(metadataKey, instance[methodName]);

      if (!item || !item.setDiscoveryMeta || !item.setContextCallback) return;

      item.setDiscoveryMeta({
        class: instance.constructor,
        handler: instance[methodName]
      });
      item.setContextCallback(this.createContextCallback(instance, prototype, methodName));

      return item;
    });
  }

  private createContextCallback(instance: object, prototype: unknown, methodName: string): (...args: any[]) => Promise<any> {
    return this.externalContextCreator.create<Record<number, ParamMetadata>, DjsContextType>(
      instance,
      prototype[methodName],
      methodName,
      ROUTE_ARGS_METADATA,
      this.djsParamsFactory,
      STATIC_CONTEXT,
      undefined,
      { guards: true, filters: true, interceptors: true },
      'djs'
    );
  }
}
