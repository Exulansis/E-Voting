const config = require('../config.json')

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      from: config.addresses.admin,
      gas: 4600000
    }
  }
};
