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
    this.client = redis.createClient({ url: REDIS_URL });
    this.client.on("error", (error) => console.error(`Error : ${error}`));
  }

  async connect() {
    await this.client.connect();
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
}

export default new RedisCache();