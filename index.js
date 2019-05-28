const request = require('request');

class Slackbot {
  constructor (params) {
    if (!params.name || !params.token) {
      throw new Error('Requires the name and bot token.');
    }
    this.token = params.token;
    this.name = params.name;
  }

  searchMyMessages ({query, count = 5, params}) {
    params = {
      ...params,
      query: `from:${this.name} ${query}`
    };
    return this.searchAllMessages(params);
  }

  searchAllMessages ({query, count = 5, params}) {
    params = {
      ...params,
      query,
      count
    };
    return this._api('chat.update', params);
  }

  postMessage ({channel, text, params}) {
    params = {
      ...params,
      text,
      channel
    };
    return this._api('chat.postMessage', params);
  }

  updateMessage ({channel, ts, text, params}) {
    params = {
      ...params,
      ts,
      text,
      channel
    };
    return this._api('chat.update', params);
  }

  _api (method, params) {
    const data = {
      token: this.token,
      url: 'https://slack.com/api/' + method,
      body: JSON.stringify(params)
    };

    return new Promise((res, rej) => {
      return request.post(data, (err, response, body) => {
        if (err) { return rej(err); }
        try {
          body = JSON.parse(body);
          return body.ok ? res(body) : rej(body);
        } catch (e) {
          return rej(e);
        }
      });
    });
  }
}
