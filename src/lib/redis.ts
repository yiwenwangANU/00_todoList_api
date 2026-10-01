import "dotenv/config";
import { RedisClient } from "bun";

const url = process.env.REDIS_URL;

const redis = new RedisClient(url);

const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("Redis connected.");
  } catch (e) {
    console.error(e);
    redis.close();
    process.exit(1);
  }
};

const disconnectRedis = () => {
  redis.close();
};

export { redis, connectRedis, disconnectRedis };
