'use strict';
export interface IUnifiedorder {
  device_info?: string;
  nonce_str?: string;
  sign_type?: string;
  body: string;
  detail?: string;
  attach?: string;
  out_trade_no: string;
  fee_type?: string;
  total_fee: number;
  spbill_create_ip: string;
  time_start?: string;
  time_expire?: string;
  goods_tag?: string;
  notify_url: string;
  trade_type: string;
  product_id?: string;
  limit_pay?: string;
  openid?: string;
  receipt?: string;
  scene_info?: string;
}
