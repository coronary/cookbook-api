import { COLLECTIONS } from "../db/db";
import { DeSerializedUser, SerializedUser, User } from "../models/User";
import { BaseService } from "./BaseService";

export default class UserService extends BaseService<User, SerializedUser> {
  constructor() {
    super(COLLECTIONS.USERS, User);
  }

  public deserialize(model): DeSerializedUser {
    const {
      discordDiscriminator,
      discordId,
      discordUsername,
      discordAvatar,
      socialLinks,
      superAdmin,
    } = model;

    const deserilizedUser: DeSerializedUser = {
      discord_discriminator: discordDiscriminator,
      discord_id: discordId,
      discord_username: discordUsername,
      discord_avatar: discordAvatar,
    };

    if (superAdmin !== undefined) {
      deserilizedUser.super_admin = superAdmin;
    }

    if (socialLinks !== undefined) {
      deserilizedUser.social_links = socialLinks;
    }

    return deserilizedUser;
  }

  public serialize(document): SerializedUser {
    const {
      _id,
      discord_discriminator,
      discord_id,
      discord_username,
      discord_avatar,
      social_links,
      super_admin,
    } = document;
    return {
      id: _id,
      discordDiscriminator: discord_discriminator,
      discordId: discord_id,
      discordUsername: discord_username,
      discordAvatar: discord_avatar,
      socialLinks: social_links,
      superAdmin: super_admin,
    };
  }
}
