import { ObjectId } from "mongodb";
import UserService from "../services/UserService";
import { BaseModel } from "./BaseModel";

export interface SocialLinks {
  twitter?: string;
  discord?: string;
  youtube?: string;
  patreon?: string;
}

export interface SerializedUser {
  id?: ObjectId;
  email: string;
  discordId: string;
  discordUsername: string;
  discordAvatar: string;
  socialLinks: SocialLinks;
  superAdmin: boolean;
}

export interface DeSerializedUser {
  email: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string;
  social_links: SocialLinks;
  super_admin: boolean;
}

export class User extends BaseModel<User> {
  public _id: ObjectId | undefined;
  public email: string;
  public discord_id: string;
  public discord_username: string;
  public discord_avatar: string;
  public social_links: SocialLinks;
  public super_admin: boolean;

  constructor({
    id,
    email,
    discordId,
    discordUsername,
    discordAvatar,
    socialLinks = {},
    superAdmin = false,
  }: SerializedUser) {
    super(new UserService());
    this._id = id;
    this.email = email;
    this.discord_id = discordId;
    this.discord_username = discordUsername;
    this.discord_avatar = discordAvatar;
    this.social_links = socialLinks;
    this.super_admin = superAdmin;
  }

  deserialize(): DeSerializedUser {
    return new UserService().deserialize(this);
  }

  serialize(): SerializedUser {
    return new UserService().serialize({
      _id: this._id,
      email: this.email,
      discord_d: this.discord_id,
      discord_username: this.discord_username,
      discord_avatar: this.discord_avatar,
      social_links: this.social_links,
      super_admin: this.super_admin,
    });
  }
}
