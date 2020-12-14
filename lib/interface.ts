'use strict';
// 创建订单
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
// 查询订单
export interface IOrderquery {
  transaction_id: string;
  sign_type?: string;
  nonce_str?: string;
}
export interface IOrderquery2 {
  out_trade_no: string;
  sign_type?: string;
  nonce_str?: string;
}
// 关闭订单
export interface ICloseorder {
  out_trade_no: string;
  sign_type?: string;
  nonce_str?: string;
}
// 申请退款
export interface IRefund {
  sign_type?: string;
  nonce_str?: string;
  transaction_id: string;
  out_refund_no: string;
  total_fee: number;
  refund_fee: number;
  refund_fee_type?: string;
  refund_desc?: string;
  refund_account?: string;
  notify_url?: string;
}
export interface IRefund2 {
  sign_type?: string;
  nonce_str?: string;
  out_trade_no: string;
  out_refund_no: string;
  total_fee: number;
  refund_fee: number;
  refund_fee_type?: string;
  refund_desc?: string;
  refund_account?: string;
  notify_url?: string;
}
// 查询退款
export interface IRefundquery {
  sign_type?: string;
  nonce_str?: string;
  offset?: number;
}
export interface IRefundquery1 extends IRefundquery {
  transaction_id: string;
}
export interface IRefundquery2 extends IRefundquery {
  out_trade_no: string;
}
export interface IRefundquery3 extends IRefundquery {
  out_refund_no: string;
}
export interface IRefundquery4 extends IRefundquery {
  refund_id: string;
}
// 下载交易账单
export interface IDownloadbill {
  sign_type?: string;
  nonce_str?: string;
  bill_date: string;
  bill_type: string;
  tar_type?: string;
}
// 下载资金账单
export interface IDownloadfundflow {
  nonce_str?: string;
  bill_date: string;
  account_type: string;
  tar_type?: string;
}
// 交易保障
export interface IReport {
  sign_type?: string;
  nonce_str?: string;
  device_info?: string;
  interface_url: string;
  execute_time_: number;
  return_code: string;
  return_msg: string;
  result_code: string;
  err_code?: string;
  err_code_des?: string;
  out_trade_no?: string;
  user_ip: string;
  time?: string;
}
// 拉取订单评价数据
export interface IBatchquerycomment {
  nonce_str?: string;
  begin_time: string;
  end_time: string;
  offset: number;
  limit: number;
}
// 付款码支付
export interface IMicropay {
  sign_type?: string;
  nonce_str?: string;
  device_info?: string;
  body: string;
  detail?: string;
  attach?: string;
  out_trade_no: string;
  total_fee: number;
  fee_type?: string;
  spbill_create_ip: string;
  goods_tag?: string;
  limit_pay?: string;
  time_start?: string;
  time_expire?: string;
  receipt?: string;
  auth_code: string;
  scene_info?: string;
}
//  撤销订单
export interface IReverse {
  sign_type?: string;
  nonce_str?: string;
}
// 付款码支付
export interface IReverse1 extends IReverse {
  transaction_id: string;
}
// 撤销订单
export interface IReverse2 extends IReverse {
  out_trade_no: string;
}
// 付款码查询openid
export interface IAuthcodetoopenid {
  sign_type?: string;
  nonce_str?: string;
  auth_code: string;
}
// 发放红包接口
export interface ISendredpack {
  nonce_str?: string;
  mch_billno: string;
  send_name: string;
  re_openid: string;
  total_amount: number;
  wishing: string;
  client_ip: string;
  act_name: string;
  remark: string;
  scene_id: string;
  risk_info?: string;
}
// 发放裂变红包
export interface ISendgroupredpack {
  nonce_str?: string;
  mch_billno: string;
  send_name: string;
  re_openid: string;
  total_amount: number;
  wishing: string;
  act_name: string;
  remark: string;
  scene_id?: string;
  risk_info?: string;
}
//查询红包记录
export interface IGethbinfo {
  nonce_str?: string;
  mch_billno: string;
}
// 小程序红包
export interface ISendminiprogramhb {
  nonce_str?: string;
  mch_billno: string;
  send_name: string;
  re_openid: string;
  total_amount: number;
  wishing: string;
  act_name: string;
  remark: string;
  scene_id: string;
}
// 企业付款
export interface ITransfers {
  device_info?: string;
  nonce_str?: string;
  partner_trade_no: string;
  openid: string;
  check_name: string;
  re_user_name?: string;
  amount: number;
  desc: string;
  spbill_create_ip?: string;
}
// 查询企业付款
export interface IGettransferinfo {
  nonce_str?: string;
  partner_trade_no: string;
}
// 企业付款到银行卡API
export interface IPayBank {
  partner_trade_no: string;
  nonce_str?: string;
  enc_bank_no: string;
  enc_true_name: string;
  bank_code: string;
  amount: number;
  desc: string;
}
// 查询企业付款到银行卡
export interface IQueryBank {
  partner_trade_no: string;
  nonce_str?: string;
}
//  获取RSA加密公钥API
export interface IGetpublickey {
  nonce_str?: string;
  sign_type?: string;
}
// 发放代金券
export interface ISendCoupon {
  coupon_stock_id: string;
  partner_trade_no: string;
  openid: string;
  op_user_id?: string;
  device_info: string;
  nonce_str?: string;
  version?: string;
  type?: string;
}
// 查询代金券批次
export interface IQueryCouponStock {
  coupon_stock_id: string;
  op_user_id?: string;
  device_info?: string;
  nonce_str?: string;
  version?: string;
  type?: string;
}
// 查询代金券信息
export interface IQuerycouponsinfo {
  coupon_id: string;
  openid: string;
  stock_id: string;
  nonce_str?: string;
  op_user_id?: string;
  device_info?: string;
  version?: string;
  type?: string;
}
