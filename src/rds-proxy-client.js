const util = require('util');
const {getIamAuthToken} = require('./rds-iam');

const DEFAULT_IAM_TOKEN_TTL_MS = 10 * 60 * 1000;

function rdsProxy(ClientrdsProxy, Client) {
  util.inherits(ClientrdsProxy, Client);

  Object.assign(ClientrdsProxy.prototype, {
    driverName: 'pg',

    async query(connection, queryParam) {
      await this._ensureIamToken();
      return Client.prototype.query.call(this, connection, queryParam);
    },

    async acquireRawConnection() {
      await this._ensureIamToken();
      return Client.prototype.acquireRawConnection.call(this);
    },

    async _ensureIamToken() {
      const iamAuth = this._getIamAuthConfig();

      if (!iamAuth) {
        return;
      }

      const nowMs = Date.now();

      if (this._iamToken && this._iamTokenCreatedAtMs) {
        if (nowMs - this._iamTokenCreatedAtMs < this._iamTokenTtlMs) {
          return;
        }
      }

      if (this._iamTokenPromise) {
        await this._iamTokenPromise;
        return;
      }

      this._iamTokenPromise = this._refreshIamToken(iamAuth);

      try {
        await this._iamTokenPromise;
      } finally {
        this._iamTokenPromise = null;
      }
    },

    _getIamAuthConfig() {
      if (this._iamAuthResolved) {
        return this._iamAuthConfig;
      }

      const connectionSettings = this.connectionSettings || {};

      this._iamAuthResolved = true;

      const host = connectionSettings.host;
      const port = connectionSettings.port;
      const username = connectionSettings.user;

      this._iamAuthConfig = {host, port, username};

      const ttl = connectionSettings.iamTokenTtlMs || this.config.iamTokenTtlMs;
      this._iamTokenTtlMs = typeof ttl === 'number' && ttl > 0 ? ttl : DEFAULT_IAM_TOKEN_TTL_MS;

      return this._iamAuthConfig;
    },

    async _refreshIamToken(iamAuth) {
      const tokenProvider = iamAuth.tokenProvider || getIamAuthToken;
      const token = await tokenProvider({
        host: iamAuth.host,
        port: iamAuth.port,
        username: iamAuth.username,
        credentials: iamAuth.credentials,
      });

      this._iamToken = token;
      this._iamTokenCreatedAtMs = Date.now();

      if (this.connectionSettings) {
        this.connectionSettings.password = token;
      }

      return token;
    },
  });
}

module.exports = rdsProxy;
