const _ = require('lodash');
const request = require('request-promise-native');
const utils = require('./utils');

class UpYun {
  constructor(bucket, operator, password) {
    this.bucket = bucket;
    this.operator = operator;
    this.password = password;
  }

  generateUpYunSignature({ method, uri, date }) {
    const data = [method, uri, date];
    return utils.base64Sha1({ str: data.join('&'), secret: utils.md5(this.password) });
  }

  async _request(options) {
    const date = (new Date()).toGMTString();

    const { method, uri } = options;
    const signature = this.generateUpYunSignature({ method, uri, date });

    options = _.assign({
      headers: {
        Authorization: `UPYUN ${this.operator}:${signature}`,
        Date: date
      }
    }, options);


    return await request(options);
  }

  async faceMatch(body) {
    const uri = `/${this.bucket}/facedet/match`;
    const baseUrl = 'http://p1.api.upyun.com';
    const method = 'POST';

    return await this._request({ baseUrl, uri, method, body, json: true });
  }

  async pretreatment(form) {
    const uri = '/pretreatment/';
    const method = 'POST';
    const baseUrl = 'http://p0.api.upyun.com';

    return await this._request({ baseUrl, uri, method, form });
  }
}

module.exports = UpYun;
