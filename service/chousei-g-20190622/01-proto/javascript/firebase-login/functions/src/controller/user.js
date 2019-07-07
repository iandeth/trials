'use strict';
const utils = require('../utils');

class UserC {
  async getOfflineAccess(req, res) {
    let user = await utils.CurrentUser.get(req);
    if(!user) return res.send('no user found');

    let code = (req.body.data || {}).code;
    if(!code) return res.send('no google auth token found');

    // get access|refresh tokens from Google API
    // it'll also save to user_secrets database via event handler
    let token = await utils.GAPI.getToken(code, user);

    var _token = Object.assign({}, token);
    if(_token.refresh_token) _token.refresh_token = '[not shown]';  // for security
    let d = { token:_token, user:user };
    return res.send({ data:d });
  }
}

module.exports = UserC;
