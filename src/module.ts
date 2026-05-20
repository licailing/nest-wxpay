import { WechatOptions , WechatAsyncOptions} from './types'
import { DynamicModule, Module, Provider } from '@nestjs/common'
import { WechatService } from './service'

@Module({})
export class WechatModule {
  static register(options: WechatOptions): DynamicModule {
    return {
      global: true,
      module: WechatModule,
      exports: [WechatService],
      providers: [
        {
          provide: 'WECHAT_OPTIONS',
          useValue: options
        },
        WechatService
      ]
    }
  }

  static registerAsync(options: WechatAsyncOptions): DynamicModule {
    return {
      global: !!options.global,
      module: WechatModule,
      imports: options.imports || [],
      exports: [WechatService],
      providers: [
        ...this.createAsyncProviders(options),
        WechatService
      ]
    };
  }

  private static createAsyncProviders(options: WechatAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'WECHAT_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || []
        }
      ];
    }
    return [];
  }
}
