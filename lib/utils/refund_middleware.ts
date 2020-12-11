'use strict';
import xml2js from 'xml2js';

// koa中间件
export = (): any => {
  return async (ctx: any, next: () => Promise<any>) => {
    let paramsJson = null;
    const contentType = ctx.headers['content-type'] || 'application/json';
    if (contentType.indexOf('xml') !== -1) {
      // xml格式参数获取
      let data = '';
      ctx.req.setEncoding('utf8');
      ctx.req.on('data', function (chunk: any) {
        data += chunk;
      });

      const getxml: any = await new Promise(function (resolve) {
        ctx.req.on('end', function () {
          resolve(data);
        });
      });
      const parseObj: any = await new Promise(function (resolve) {
        xml2js.parseString(
          getxml,
          {
            explicitArray: false,
          },
          function (err, json) {
            if (err) throw err;
            return resolve(json);
          }
        );
      });
      if (parseObj.xml) delete parseObj.xml._;
      paramsJson = parseObj.xml;
    }
    ctx.request.body = paramsJson;
    await next();
  };
};
