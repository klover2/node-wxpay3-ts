'use strict';
import {WxPay2, IWxPay} from './lib';
import {IUnifiedorder} from './lib/interface';
class WxPay extends WxPay2 {
  private _xml = '';
  constructor(obj: IWxPay) {
    super(obj);
  }
  // 参数处理
  private _paramsDeal(params: IUnifiedorder, properties: string[]) {
    super._joinotherParams(params);
    super._checkParams(properties);
  }
  // 请求
  private async request(name: string, obj: any): Promise<any> {
    if (obj.sign_type === 'MD5') {
      obj.sign = super._md5(obj);
    } else {
      obj.sign = super._hmac(obj);
    }
    this._xml = super._jsontoxml(obj);
    return await super._request(name, this._xml);
  }
  // md5加密 暴露给外部调用
  public md5(params: object) {
    return super._md5(params);
  }
  // HMAC-SHA256 加密 暴露给外部调用
  public hmac(params: object) {
    return super._hmac(params);
  }
  // xml 转json 暴露给外部调用
  public xmltojson(params: string) {
    return super._xmltojson(params);
  }
  // 统一下单
  public async unifiedorder(params: IUnifiedorder): Promise<object> {
    const properties: string[] = [];
    if (params.trade_type === 'JSAPI') properties.push('openid');
    if (params.trade_type === 'NATIVE') properties.push('product_id');
    if (params.trade_type === 'MWEB') {
      properties.push('scene_info');
      properties.push('redirect_url');
    }
    this._paramsDeal(params, properties);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('unifiedorder', obj);

    return result;
  }
}
export = WxPay;
