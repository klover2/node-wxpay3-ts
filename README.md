
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
其他接口和微信文档路径同名 同上一样使用

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
4. callback_check 支付回调验证 参数object 返回boolean
```bash
// 路由
router.post('/refund', async ctx => {
  // 微信返回的数据是xml格式 调用wxpay.xmltojson() 获得的参数就是data
  let result = wxpay.callback_check(data)
====》 result = true 则校验成功
ctx.type = 'application/xml';
ctx.body =
            `<xml>
                <return_code><![CDATA[SUCCESS]]></return_code>
                <return_msg><![CDATA[OK]]></return_msg>
            </xml>`;
            return;
});
```
5. publicEncrypt 公钥加密
```bash
wxpay.publicEncrypt(publicKey, data)
```

## 其他
如果使用的是`1.*.*` 请看[文档](https://github.com/klover2/node-wxpay/blob/master/README.md)