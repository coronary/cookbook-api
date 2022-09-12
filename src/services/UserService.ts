import { COLLECTIONS } from "../db/db";
import { DeSerializedUser, SerializedUser, User } from "../models/User";
import { BaseService } from "./BaseService";

export default class UserService extends BaseService<User> {
  constructor() {
    super(COLLECTIONS.USERS, User);
  }

  public deserialize(model): DeSerializedUser {
    const {
      email,
      discordId,
      discordUsername,
      discordAvatar,
      socialLinks,
      superAdmin,
    } = model;
    return {
      email,
      discord_id: discordId,
      discord_username: discordUsername,
      discord_avatar: discordAvatar,
      social_links: socialLinks,
      super_admin: superAdmin,
    };
  }

  public serialize(document): SerializedUser {
    const {
      _id,
      email,
      discord_id,
      discord_username,
      discord_avatar,
      social_links,
      super_admin,
    } = document;
    return {
      id: _id,
      email,
      discordId: discord_id,
      discordUsername: discord_username,
      discordAvatar: discord_avatar,
      socialLinks: social_links,
      superAdmin: super_admin,
    };
  }
}
