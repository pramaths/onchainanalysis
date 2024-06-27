const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "",
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries >= 10) {
        return new Error('Retry limit reached');
      }
      return Math.min(retries * 50, 500);
    },
  },
});

client.on("error", (err) => {
  console.log(`Redis Error: ${err}`);
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error(`Failed to connect to Redis: ${err}`);
  }
})();

module.exports = client;
