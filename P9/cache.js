const NodeCache = require('node-cache');

// Initialize cache with standard TTL of 60 seconds and checkperiod of 120 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

module.exports = cache;
