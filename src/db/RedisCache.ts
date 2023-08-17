import * as redis from "redis";

const REDIS_URL = process.env.REDIS_URL;

class RedisCache {
  public client;

  constructor() {
    this.client = redis.createClient({ url: REDIS_URL });
    this.client.on("error", (error) => console.error(`Error : ${error}`));
  }

  async connect() {
    await this.client.connect();
  }

  async set(key, value) {
    await this.client.set(key, value);
  }

  async get(key) {
    return await this.client.get(key);
  }
}

export default new RedisCache();
