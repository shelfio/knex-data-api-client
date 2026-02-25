const MySqlClient = require('knex/lib/dialects/mysql');
const rdsProxy = require('./rds-proxy-client');
const constants = require('./constants');

// Call mysql client to setup knex, this set as this function
const client = MySqlClient.constructor
  ? class MysqlClientRDSProxy extends MySqlClient {}
  : function MysqlClientRDSProxy(config) {
      MySqlClient.call(this, config);
    };

rdsProxy(client, MySqlClient, constants.dialects.mysql);

module.exports = client;
