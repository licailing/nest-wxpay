### 声明
本仓库功能基于 https://github.com/jaques-tino/nest-wxpay 

### nestjs 微信支付

支持商户平台证书、商户微信支付公钥验证签名

## 安装

```bash
npm i --save @licailing/nest-wxpay
yarn add @licailing/nest-wxpay
```

## 注册模块

```ts
import { Module } from "@nestjs/common";
import { WechatModule } from "@licailing/nest-wxpay";

@Module({
  imports: [
    WechatModule.register({
      appid: "公众号的appid",
      mchid: "微信支付商户号",
      serial_no: "商户API证书序列号",
      privateKey: "商户API证书私钥",
      apiv3Key: "apiv3密钥",
      pubKey: "商户微信支付公钥", // 可选 商户微信支付公钥如果不为空则使用公钥验签,没有则用平台证书验签
    }),
  ],
})
// 或者
@Module({
  imports: [
    WechatModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          appid: configService.get<string>("公众号的appid"),
          mchid: configService.get<string>("微信支付商户号"),
          serial_no: configService.get<string>("商户API证书序列号"),
          privateKey: Buffer.from(configService.get<string>("商户API证书私钥")),
          apiv3Key: configService.get<string>("apiv3密钥"),
          pubKey: "商户微信支付公钥", // 可选 商户微信支付公钥如果不为空则使用公钥验签,没有则用平台证书验签
        };
      },
    }),
  ],
})
export class AppModule {}
```

## 发起jsapi支付

```ts
import { WechatService } from "@licailing/nest-wxpay";

// ...省略
async crateWxPay(params: CreateWechatPreOrder) {
  const { prepay_id } = await this.wechatService.createJsapiOrder({
    amount: { total: amount, currency: 'CNY' },
    description: '描述',
    notify_url: '支付回调地址',
    out_trade_no: '交易号',
    payer: { openid: '用户openid' },
    attach: '附加数据',
  });
  ...
}
// ...省略
```

## 支付注册回调验签

```ts
import { WechatService } from "@licailing/nest-wxpay";

// ...省略
const {
  "wechatpay-nonce": nonce_str,
  "wechatpay-signature": signature,
  "wechatpay-timestamp": timestamp,
  "wechatpay-serial": serial_no,
} = headers;
// 支持商户平台证书、商户微信支付公钥验证签名
const isVerify = await this.wechatService.verifySign({
  timestamp: Number(timestamp),
  nonce_str,
  requestBody: JSON.stringify(body),
  signature,
  serial_no,
});
if (!isVerify) return res.status(400).send({ code: "FAIL", message: "失败" });
// ...省略
```
