'use strcit';
import {WxPay2, IWxPay} from './index';
import crypto from 'crypto';
import {
  ISendredpack,
  ISendgroupredpack,
  IGethbinfo,
  ISendminiprogramhb,
  ITransfers,
  IGettransferinfo,
  IPayBank,
  IQueryBank,
  IGetpublickey,
  ISendCoupon,
  IQueryCouponStock,
  IQuerycouponsinfo,
} from './interface';
import {getNonceStr} from './utils/util';

export default class Withdraw extends WxPay2 {
  protected _xml = '';
  constructor(obj: IWxPay) {
    super(obj);
  }
  // 参数处理
  protected _paramsDeal(params: object, properties: string[]) {
    super._joinotherParams(params);
    super._checkParams(properties);
  }
  // 请求
  protected async request(name: string, obj: any): Promise<any> {
    if (obj.sign_type === 'HMAC-SHA256') {
      obj.sign = super._hmac(obj);
    } else {
      obj.sign = super._md5(obj);
    }
    this._xml = super._jsontoxml(obj);
    return await super._request(name, this._xml);
  }
  // 公钥加密
  public publicEncrypt(publicKey: string, data: string): string {
    // const clientKey = new NodeRSA(publicKey);
    // // 在node-rsa模块中加解密默认使用 pkcs1_oaep ,而在js中加密解密默认使用的是 pkcs1
    // clientKey.setOptions({ 'encryptionScheme': 'pkcs1_oaep' }); //  RSA_PKCS1_OAEP_PADDING
    // let encrypted = clientKey.encrypt(data, 'base64');
    // return encrypted;

    return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
  }
  // 发放红包
  public async sendredpack(params: ISendredpack): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      wxappid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
      total_num: 1,
    };
    const result = await this.request('sendredpack', obj);
    return result;
  }
  // 发放裂变红包
  public async sendgroupredpack(params: ISendgroupredpack): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      wxappid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
      amt_type: 'ALL_RAND',
    };
    const result = await this.request('sendgroupredpack', obj);
    return result;
  }
  // 查询红包记录
  public async gethbinfo(params: IGethbinfo): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
      bill_type: 'MCHT',
    };
    const result = await this.request('gethbinfo', obj);
    return result;
  }
  // 小程序红包
  public async sendminiprogramhb(params: ISendminiprogramhb): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      wxappid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
      total_num: 1,
      notify_way: 'MINI_PROGRAM_JSAPI',
    };
    const result = await this.request('sendminiprogramhb', obj);
    const _data: any = {};
    if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS' && result.package) {
      _data['timestamp'] = `${parseInt(+new Date() / 1000 + '')}`;
      _data['package'] = encodeURIComponent(result.package);
      _data['signType'] = 'MD5';
      _data['nonceStr'] = getNonceStr().toLowerCase();
      _data['paySign'] = this._md5(_data);

      _data['return_code'] = 'SUCCESS';
      _data['result_code'] = 'SUCCESS';
      _data['return_msg'] = 'OK';
      return _data;
    }
    return result;
  }
  // 企业付款到零钱
  public async transfers(params: ITransfers): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      mch_appid: this.appid,
      mchid: this.mch_id,
      ...this._params,
    };
    const result = await this.request('transfers', obj);
    return result;
  }
  // 查询企业付款到零钱
  public async gettransferinfo(params: IGettransferinfo): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('gettransferinfo', obj);
    return result;
  }
  // 企业付款到银行卡API
  public async pay_bank(params: IPayBank): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('pay_bank', obj);
    return result;
  }
  // 查询企业付款到银行卡
  public async query_bank(params: IQueryBank): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('query_bank', obj);
    return result;
  }
  // 获取RSA加密公钥API
  public async getpublickey(params: IGetpublickey): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('getpublickey', obj);
    return result;
  }
  // 发放代金券
  public async send_coupon(params: ISendCoupon): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
      openid_count: 1,
    };
    const result = await this.request('send_coupon', obj);
    return result;
  }
  // 查询代金券批次
  public async query_coupon_stock(params: IQueryCouponStock): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('query_coupon_stock', obj);
    return result;
  }
  // 查询代金券信息
  public async querycouponsinfo(params: IQuerycouponsinfo): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('querycouponsinfo', obj);
    return result;
  }
}
