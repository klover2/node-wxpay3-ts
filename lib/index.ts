'use strict';
import md5 from 'md5';
import crypto from 'crypto';
import xml2js from 'xml2js';
import request from 'superagent';
import {getNonceStr} from './utils/util';
// xmlBuilder工具
const builder = new xml2js.Builder({
  headless: true,
  allowSurrogateChars: true,
  rootName: 'xml',
  cdata: true,
});

// 请求路径
const urls: any = {
  unifiedorder: 'https://api.mch.weixin.qq.com/pay/unifiedorder', // 统一下单
  orderquery: 'https://api.mch.weixin.qq.com/pay/orderquery', // 查询订单
  closeorder: 'https://api.mch.weixin.qq.com/pay/closeorder', // 关闭订单
  refund: 'https://api.mch.weixin.qq.com/secapi/pay/refund', // 申请退款
  refundquery: 'https://api.mch.weixin.qq.com/pay/refundquery', // 查询退款
  downloadbill: 'https://api.mch.weixin.qq.com/pay/downloadbill', // 下载交易账单
  downloadfundflow: 'https://api.mch.weixin.qq.com/pay/downloadfundflow', // 下载资金账单
  report: 'https://api.mch.weixin.qq.com/payitil/report', // 交易保障
  batchquerycomment: 'https://api.mch.weixin.qq.com/billcommentsp/batchquerycomment', // 拉取订单评价数据
  reverse: 'https://api.mch.weixin.qq.com/secapi/pay/reverse', // 撤销订单
  micropay: 'https://api.mch.weixin.qq.com/pay/micropay', // 付款码支付
  authcodetoopenid: 'https://api.mch.weixin.qq.com/tools/authcodetoopenid', // 付款码查询openid

  sendredpack: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack', // 发放红包
  sendgroupredpack: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendgroupredpack', // 发放裂变红包
  gethbinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo', // 查询红包记录
  sendminiprogramhb: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendminiprogramhb', // 小程序红包
  transfers: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers', // 企业付款到零钱
  gettransferinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gettransferinfo', // 查询企业付款到零钱
  pay_bank: 'https://api.mch.weixin.qq.com/mmpaysptrans/pay_bank', // 企业付款到银行卡
  query_bank: 'https://api.mch.weixin.qq.com/mmpaysptrans/query_bank', // 查询企业付款到银行卡
  getpublickey: 'https://fraud.mch.weixin.qq.com/risk/getpublickey', // 获取RSA加密公钥
  send_coupon: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/send_coupon', // 发放代金券
  query_coupon_stock: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/query_coupon_stock', // 查询代金券批次
  querycouponsinfo: 'https://api.mch.weixin.qq.com/mmpaymkttransfers/querycouponsinfo', // 查询代金券信息
};

export interface IWxPay {
  appid: string;
  mch_id: string;
  key: string;
  pfx?: any;
}

export class WxPay2 {
  protected appid: string;
  protected mch_id: string;
  protected key: string;
  protected pfx: any;
  protected _params: any = {};

  constructor(obj: IWxPay) {
    this.appid = obj.appid;
    this.mch_id = obj.mch_id;
    this.key = obj.key;
    this.pfx = obj.pfx;
  }
  // 加入其它参数
  protected _joinotherParams(params: object) {
    this._params = {
      // sign_type: 'MD5',
      nonce_str: getNonceStr(),
      ...params,
    };
  }
  // 参数检验
  protected _checkParams(properties: string[]) {
    properties.forEach(item => {
      if (this._params[item] === undefined || this._params[item] === null)
        throw new Error('缺少' + item);
    });
  }
  // MD5加密
  protected _md5(params: any): string {
    const querystring =
      Object.keys(params)
        .filter(function (key) {
          return (
            params[key] !== undefined &&
            params[key] !== '' &&
            !['pfx', 'sign', 'key', 'redirect_url'].includes(key)
          );
        })
        .sort()
        .map(function (key) {
          return key + '=' + params[key];
        })
        .join('&') +
      '&key=' +
      this.key;
    return md5(querystring).toUpperCase();
  }
  // HMAC-SHA256 加密
  protected _hmac(params: any): string {
    const querystring =
      Object.keys(params)
        .filter(function (key) {
          return (
            params[key] !== undefined &&
            params[key] !== '' &&
            !['pfx', 'sign', 'key', 'redirect_url'].includes(key)
          );
        })
        .sort()
        .map(function (key) {
          return key + '=' + params[key];
        })
        .join('&') +
      '&key=' +
      this.key;
    const hash = crypto.createHmac('sha256', this.key).update(querystring).digest('hex');

    return hash.toUpperCase();
  }
  // jsontoxml
  protected _jsontoxml(params: any): string {
    // 移除证书
    delete params['pfx'];
    delete params['key']; // 移除密钥 不然会报{ return_code: 'FAIL', return_msg: '不识别的参数key' }
    delete params['redirect_url'];

    // 生成请求统一下单下单xml参数
    const xmlOption = builder.buildObject(params);
    return xmlOption;
  }
  // _xmltojson
  protected _xmltojson(params: string): object {
    let body = {};
    xml2js.parseString(params, {trim: true, explicitArray: false}, (err, result) => {
      if (err) {
        // throw new Error(err);
        console.error(err);
        body = {};
      } else {
        body = result.xml;
      }
    });

    return body;
  }
  // 请求
  protected async _request(name: string, xml: string): Promise<object> {
    const url = urls[name];
    const result = await request
      .post(url)
      .send(xml)
      .pfx({
        ...(this.pfx && {
          pfx: this.pfx, // 证书
          passphrase: this.mch_id, // 证书秘钥【微信设置为商户号id】
        }),
      })
      .type('xml');

    // 判断返回格式
    if (result.type === 'text/plain' || result.type === 'text/html' || result.type === 'text/xml') {
      if (result.text.indexOf('<xml>') !== -1) {
        return this._xmltojson(result.text);
      }
      return {
        data: result.text,
        return_code: 'SUCCESS',
        result_code: 'SUCCESS',
        return_msg: 'OK',
      };
    } else if (result.type === 'application/x-gzip') {
      return {
        data: result.body,
        return_code: 'SUCCESS',
        result_code: 'SUCCESS',
        return_msg: 'OK',
      };
    } else if (result.type === 'application/xml') {
      return this._xmltojson(result.body.toString());
    } else {
      return result;
    }
  }
}
