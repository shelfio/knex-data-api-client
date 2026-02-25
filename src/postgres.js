const PostgresClient = require('knex/lib/dialects/postgres');
const rdsProxy = require('./rds-proxy-client');
const constants = require('./constants');

// Call postgres client to setup knex, this set as this function
const client = PostgresClient.constructor
  ? class PostgresClientRDSProxyIam extends PostgresClient {}
  : function PostgresClientRDSProxy(config) {
      PostgresClientRDSProxy.call(this, config);
    };

rdsProxy(client, PostgresClient, constants.dialects.postgres);

module.exports = client;
