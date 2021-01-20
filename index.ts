'use strict';
import Withdraw from './lib/withdraw';
import {
  IUnifiedorder,
  IOrderquery,
  IOrderquery2,
  ICloseorder,
  IRefund,
  IRefund2,
  IRefundquery1,
  IRefundquery2,
  IRefundquery3,
  IRefundquery4,
  IDownloadbill,
  IDownloadfundflow,
  IReport,
  IBatchquerycomment,
  IMicropay,
  IReverse1,
  IReverse2,
  IAuthcodetoopenid,
} from './lib/interface';
import {getNonceStr} from './lib/utils/util';
class WxPay extends Withdraw {
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

    const {prepay_id, return_code, return_msg, result_code} = result;
    if (return_code !== 'SUCCESS' || result_code !== 'SUCCESS') return result;

    // 参数处理
    let _data: any = {};
    switch (this._params.trade_type) {
      case 'JSAPI':
        _data['appId'] = this.appid;
        _data['timeStamp'] = `${parseInt(+new Date() / 1000 + '')}`;
        _data['package'] = `prepay_id=${prepay_id}`;
        _data['nonceStr'] = getNonceStr().toLowerCase();
        _data['signType'] = params['sign_type'] || 'MD5';
        if (params['sign_type'] === 'HMAC-SHA256') {
          _data['paySign'] = this._hmac(_data);
        } else {
          _data['paySign'] = this._md5(_data);
        }

        break;
      case 'APP':
        _data['appid'] = this.appid;
        _data['timestamp'] = `${parseInt(+new Date() / 1000 + '')}`;
        _data['partnerid'] = this.mch_id;
        _data['prepayid'] = prepay_id;
        _data['package'] = 'Sign=WXPay';
        _data['noncestr'] = getNonceStr().toLowerCase();
        if (params['sign_type'] === 'HMAC-SHA256') {
          _data['sign'] = this._hmac(_data);
        } else {
          _data['sign'] = this._md5(_data);
        }
        break;
      case 'NATIVE': // pc端网站 模式二
        _data = {
          // 把code_url 生成图片
          ...result,
        };
        break;
      case 'MWEB':
        // 不能直接在浏览器中访问mweb_url,会报商家参数错误，因为他会检测Referer,所以Referer不能为空
        // 手机浏览器中支付  https://wx.tenpay.com/cgi-bin/mmpayweb-bin/checkmweb?prepay_id=wx20161110163838f231619da20804912345&package=1037687096&redirect_url=https%3A%2F%2Fwww.wechatpay.com.cn
        _data = {
          ...result,
          mweb_url:
            result.mweb_url + `&redirect_url=${encodeURIComponent(this._params.redirect_url)}`,
        };
        break;
      default:
        console.error('trade_type参数有误');
        _data = {};
    }
    return {..._data, return_code: 'SUCCESS', result_code: 'SUCCESS', return_msg: 'OK'};
  }
  // 支付回调验证
  public callback_check(data: any): boolean {
    let _sign = '';
    if (data.sign_type === 'HMAC-SHA256') {
      _sign = this._hmac(data);
    } else {
      _sign = this._md5(data);
    }
    return data.sign === _sign; // boolean true 成功
  }
  // 订单查询
  public async orderquery(params: IOrderquery | IOrderquery2): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };

    const result = await this.request('orderquery', obj);
    return result;
  }
  // 关闭订单
  public async closeorder(params: ICloseorder): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };

    const result = await this.request('closeorder', obj);
    return result;
  }
  // 申请退款
  public async refund(params: IRefund | IRefund2): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('refund', obj);
    return result;
  }
  // 查询退款
  public async refundquery(
    params: IRefundquery1 | IRefundquery2 | IRefundquery3 | IRefundquery4
  ): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('refundquery', obj);
    return result;
  }
  // 下载交易账单
  public async downloadbill(params: IDownloadbill): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('downloadbill', obj);
    return result;
  }
  // 下载资金账单
  public async downloadfundflow(params: IDownloadfundflow): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(
      {
        ...params,
        sign_type: 'HMAC-SHA256',
      },
      []
    );

    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('downloadfundflow', obj);
    return result;
  }
  // 交易保障
  public async report(params: IReport): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('report', obj);
    return result;
  }
  // 拉取订单评价数据
  public async batchquerycomment(params: IBatchquerycomment): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(
      {
        ...params,
        sign_type: 'HMAC-SHA256',
      },
      []
    );
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('batchquerycomment', obj);
    return result;
  }
  // 付款码支付
  public async micropay(params: IMicropay): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('micropay', obj);
    return result;
  }
  // 撤销订单(只支持付款码支付的订单才可以撤销，统一下单生成的订单不能撤销)
  public async reverse(params: IReverse1 | IReverse2): Promise<object> {
    if (!this.pfx) throw new Error('缺少pfx');
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('reverse', obj);
    return result;
  }
  // 付款码查询openid
  public async authcodetoopenid(params: IAuthcodetoopenid): Promise<object> {
    this._paramsDeal(params, []);
    const obj: object = {
      appid: this.appid,
      mch_id: this.mch_id,
      ...this._params,
    };
    const result = await this.request('authcodetoopenid', obj);
    return result;
  }
}
export = WxPay;
