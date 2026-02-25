# knex-rds-proxy-client

Knex RDS Proxy Client

[![npm](https://img.shields.io/npm/v/knex-rds-proxy-client.svg)](https://www.npmjs.com/package/knex-rds-proxy-client)
[![npm](https://img.shields.io/npm/l/knex-rds-proxy-client.svg)](https://www.npmjs.com/package/knex-rds-proxy-client)

This is a fork of the knex-data-api-client by @alan-cooney, adapted for AWS RDS Proxy IAM authentication.

The **Knex RDS Proxy Client** is a Knex extension that refreshes IAM auth tokens for AWS RDS Proxy connections in Postgres and MySQL.

## Configuration

The library uses AWS credentials to generate IAM auth tokens for RDS Proxy. Set `AWS_REGION` or `AWS_DEFAULT_REGION`, and provide IAM credentials via the default AWS SDK chain or the `iamAuth.credentials` option.
Tokens are cached for `iamTokenTtlMs` (default 10 minutes).

## Use

To use RDS Proxy in MySQL mode:

```javascript
const knexRdsProxyClient = require('knex-rds-proxy-client');
const knex = require('knex')({
  client: knexRdsProxyClient.mysql,
  connection: {
    host: 'proxy-endpoint',
    port: 3306,
    user: 'db-user',
    database: 'db-name',
    iamTokenTtlMs: 10 * 60 * 1000,
  },
});
```

To use RDS Proxy in Postgres mode:

```javascript
const knexRdsProxyClient = require('knex-rds-proxy-client');
const knex = require('knex')({
  client: knexRdsProxyClient.postgres,
  connection: {
    host: 'proxy-endpoint',
    port: 5432,
    user: 'db-user',
    database: 'db-name',
    iamTokenTtlMs: 10 * 60 * 1000,
  },
});
```

## Credits

Forked from [Skyhook](https://www.skyhookadventure.com) [knex-data-api-client](https://github.com/alan-cooney/knex-data-api-client) and provided under an MIT license.
