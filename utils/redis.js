// redis.js
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Redis Error: ${err}`);
});

module.exports = client;

client.connect();