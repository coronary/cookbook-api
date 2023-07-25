import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface SocialLinks {
  twitter?: string;
  discord?: string;
  youtube?: string;
  patreon?: string;
}

export interface SanitizedUser {
  id?: ObjectId;
  discordId: string;
  discordUsername: string;
  discordAvatar: string;
  socialLinks?: SocialLinks;
  superAdmin?: boolean;
}

export interface SerializedUser {
  id?: ObjectId;
  discordId: string;
  discordUsername: string;
  discordAvatar: string;
  socialLinks: SocialLinks;
  superAdmin: boolean;
}

export interface DeSerializedUser {
  _id: ObjectId;
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  social_links: SocialLinks;
  super_admin?: boolean;
}

export class User extends BaseModel {
  public id: ObjectId | undefined;
  public discordId: string;
  public discordUsername: string;
  public discordAvatar: string;
  public socialLinks: SocialLinks;
  public superAdmin: boolean;

  constructor({
    id,
    discordId,
    discordUsername,
    discordAvatar,
    socialLinks = {},
    superAdmin = false,
  }: {
    id?: ObjectId;
    discordId: string;
    discordUsername: string;
    discordAvatar: string;
    socialLinks?: SocialLinks;
    superAdmin?: boolean;
  }) {
    super();
    this.id = id;
    this.discordId = discordId;
    this.discordUsername = discordUsername;
    this.discordAvatar = discordAvatar;
    this.socialLinks = socialLinks;
    this.superAdmin = superAdmin;
  }

  public sanitize(): SanitizedUser {
    const rv: SanitizedUser = {
      id: this.id,
      discordId: this.discordId,
      discordUsername: this.discordUsername,
      discordAvatar: this.discordAvatar,
    };

    if (this.socialLinks != null) {
      rv.socialLinks = this.socialLinks;
    }

    if (this.superAdmin) {
      rv.superAdmin = this.superAdmin;
    }

    return rv;
  }
}
