
# node-wxpay3
(支付文档v2)
[普通商户接入文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)

## 前言
本模块集成了大部分微信支付、提现等模块的接口，采用async、await的方式调用，使用者不用在考虑参数加密发送，秘钥发送方式、xml怎么解析、json怎么转成xml等一系列麻烦事。 
## 安装 
`npm i node-wxpay3 --save`

## 版本介绍
本版本是`2.*.*`相对于旧版本[`1.*.*`](https://github.com/klover2/node-wxpay/blob/master/README.md)做了大的变更，本插件改用typescript重写，合并了旧的接口方法。支持`require` 和 `import`两种方法导入。

## 使用
`const WxPay = require('node-wxpay3'); ` 或者 `import WxPay from 'node-wxpay3'`
```bash
// https://api.mch.weixin.qq.com/pay/unifiedorder
const wxpay = new Wxpay({
  appid: '',
  mch_id: '',
  key: '',
  pfx: fs.readFileSync('./apiclient_cert.p12'),
});
const options = {
    body: '测试',
    out_trade_no: '23214234, 
    total_fee: 1,
    spbill_create_ip: 'ip',
    notify_url: 'https://域名/gateway/boboteacher/student/order/_payReturnss', //自己的接口
    trade_type: 'MWEB',
    scene_info: JSON.stringify({
      h5_info: {
        type: 'Wap',
        wap_url: 'https://域名',
        wap_name: 'bobo',
      },
    }),
    redirect_url: 'https://域名/webpage/api/index.html#/', // 支付成功 返回页面 h5支付需要
  };
  const result = await wxpay.unifiedorder(options);
```
其他接口如下: 如何使用对照微信支付文档和[旧版](https://github.com/klover2/node-wxpay/blob/master/README.md)
|接口名称|介绍  |
|--|--|
|unifiedorder  | 统一下单 |
|callback_check  | 支付回调验证 |
|orderquery  | 订单查询 |
|closeorder  | 关闭订单 |
|refund  | 申请退款 |
|refundquery  | 查询退款 |
|downloadbill  | 下载交易账单 |
|downloadfundflow  | 下载资金账单 |
|report  | 交易保障 |
|batchquerycomment  | 拉取订单评价数据 |
|micropay  | 付款码支付 |
|reverse  | 撤销订单(只支持付款码支付的订单才可以撤销，统一下单生成的订单不能撤销) |
|authcodetoopenid|付款码查询openid|
|publicEncrypt|公钥加密|
|sendredpack|发放红包|
|sendgroupredpack|发放裂变红包|
|gethbinfo|查询红包记录|
|sendminiprogramhb|小程序红包|
|transfers|企业付款到零钱|
|gettransferinfo|查询企业付款到零钱|
|pay_bank|企业付款到银行卡API|
|query_bank|查询企业付款到银行卡|
|getpublickey|获取RSA加密公钥API|
|send_coupon|发放代金券|
|query_coupon_stock|查询代金券批次|
|querycouponsinfo|查询代金券信息|


额外增加的接口：
1. md5 参数object
```bash
wxpay.md5({
 body: '测试',
 out_trade_no: '23214234, 
 })
```
2. hmac 参数object 使用同上
3. xmltojson 参数string xml 转json 暴露给外部调用 使用同上
4. callback_check 支付回调验证 参数object 返回boolean koa
```bash

  // 微信返回的数据是text/xml的数据流格式 
  // 接收数据流并且处理
  ctx.req.setEncoding('utf8');
  ctx.req.on('data', function(chunk) {
      data += chunk;
  });
  // getxml 就是xml形式的数据
  const getxml = await new Promise(function(resolve) {
        ctx.req.on('end', function() {
                resolve(data);
        });
  });

  // 调用wxpay.xmltojson(getxml) 获得的参数就是data
  let data = wxpay.xmltojson(getxml)
  let result = wxpay.callback_check(data)
====》 result = true 则校验成功
ctx.type = 'application/xml';
ctx.body =
            `<xml>
                <return_code><![CDATA[SUCCESS]]></return_code>
                <return_msg><![CDATA[OK]]></return_msg>
            </xml>`;
            return; d
```
5. publicEncrypt 公钥加密
```bash
wxpay.publicEncrypt(publicKey, data)
```

## 其他
如果使用的是`1.*.*` 请看[文档](https://github.com/klover2/node-wxpay/blob/master/README.md)