import * as redis from "redis";
import { BaseModel } from "../models/BaseModel";
import { logger } from "../utils/Logging";

const REDIS_URL = process.env.REDIS_URL;

export const Caches = {
  COOKBOOK: (cookbookName) => `cookbooks:${cookbookName}`,
  SECTION: (cookbookName, guideName, sectionName) =>
    `cookbooks:${cookbookName}:guides:${guideName}:sections:${sectionName}`,
};

class RedisCache {
  public client;

  constructor() {
    this.client = REDIS_URL != null
      ? redis.createClient({ url: REDIS_URL })
      : redis.createClient();
    this.client.on("error", (error) => console.error(`Error : ${error}`));
  }

  async connect() {
    await this.client.connect();
  }

  async flushAll() {
    await this.client.flushAll();
  }

  async set(key, value: BaseModel) {
    try {
      await this.client.set(key, JSON.stringify(value.sanitize()));
    } catch (err) {
      logger.error("Error redis.set: ", err);
    }
  }
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      logger.error("Error redis.get: ", err);
    }
  }

  async delete(key) {
    try {
      return await this.client.del(key);
    } catch (err) {
      logger.error("Error redis.delete: ", err);
    }
  }
}

export default new RedisCache();
