import { DynamicModule, ModuleMetadata, OptionalFactoryDependency, Provider, Type } from '@nestjs/common';
import { interval, lastValueFrom, race, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';

type InjectionToken = string | symbol | Type;

export interface ModuleConfigFactory<T> {
  createModuleConfig(): Promise<T> | T;
}

export type AsyncModuleConfig<T> = Pick<ModuleMetadata, 'imports' | 'exports'> &
  (
    | {
        useExisting: {
          value: ModuleConfigFactory<T>;
          provide?: InjectionToken;
        };
      }
    | { useClass: Type<ModuleConfigFactory<T>> }
    | {
        useFactory: (...args: any[]) => Promise<T> | T;
        inject?: any[];
      }
  );

export function createModuleConfigProvider<T>(provide: InjectionToken, options: AsyncModuleConfig<T>): Provider[] {
  if ('useFactory' in options) {
    return [
      {
        provide,
        useFactory: options.useFactory,
        inject: options.inject ?? []
      }
    ];
  }

  const optionsProviderGenerator = (inject: InjectionToken | OptionalFactoryDependency): Provider => ({
    provide,
    useFactory: async (moduleConfigFactory: ModuleConfigFactory<T>) => {
      return moduleConfigFactory.createModuleConfig();
    },
    inject: [inject]
  });

  if ('useClass' in options) {
    return [
      optionsProviderGenerator(options.useClass),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }
  if ('useExisting' in options) {
    return [
      optionsProviderGenerator(options.useExisting.provide ?? options.useExisting.value.constructor.name),
      {
        provide: options.useExisting.provide || options.useExisting.value.constructor.name,
        useValue: options.useExisting.value
      }
    ];
  }

  return [];
}

export interface IConfigurableDynamicRootModule<T> {
  new (): Type<T>;

  moduleSubject: Subject<DynamicModule>;

  deferred(wait?: number): Promise<DynamicModule>;
}

export function createConfigurableDynamicRootModule<T>() {
  abstract class DynamicRootModule {
    static moduleSubject = new Subject<DynamicModule>();

    static async deferred(wait = 0): Promise<DynamicModule> {
      const timeout$ = interval(wait).pipe(
        first(),
        map(() => {
          throw new Error(`Expected ${this.name} to be configured by at least one Module but it was not configured within ${wait}ms`);
        })
      );

      return lastValueFrom(race(timeout$, DynamicRootModule.moduleSubject.pipe(first())));
    }
  }

  return DynamicRootModule as IConfigurableDynamicRootModule<T>;
}
