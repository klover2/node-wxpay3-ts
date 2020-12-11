'use strict';
// 随机值
export const getNonceStr = (): string => {
  return Math.random().toString(36).substr(2, 15);
};
