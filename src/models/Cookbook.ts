import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { AppInjector } from "../app";
import GuideService from "../services/GuideService";
import { SanitizedGuide } from "./Guide";

const authRoles = ["admin", "chef"];

export interface DeSerializedCookbook {
  _id?: ObjectId;
  game: ObjectId;
  name: string;
  streams?: string[];
  roles?: any;
  preview?: boolean;
  guides?: ObjectId[];
  banner_url?: string;
  avatar_url?: string;
}

export interface SerializedCookbook {
  id?: ObjectId;
  game: ObjectId;
  name: string;
  streams?: string[];
  roles?: any;
  preview?: boolean;
  guides?: ObjectId[];
  bannerUrl?: string;
  avatarUrl?: string;
}

export interface SanitizedCookbook {
  id: ObjectId;
  game: ObjectId;
  name: string;
  streams?: string[];
  roles?: any;
  preview?: boolean;
  guides?: SanitizedGuide[];
  bannerUrl?: string;
  avatarUrl?: string;
}

export class Cookbook extends BaseModel {
  public id: ObjectId | undefined;
  public game: ObjectId;
  public name: string;
  public streams: string[];
  public roles: string[];
  public preview;
  public guides: any[];
  public bannerUrl: string | undefined;
  public avatarUrl: string | undefined;

  constructor({
    id,
    name,
    game,
    streams,
    roles,
    preview,
    guides,
    bannerUrl,
    avatarUrl,
  }: SerializedCookbook) {
    super();
    this.id = id;
    this.game = game;
    this.name = name;
    this.streams = streams;
    this.roles = roles;
    this.preview = preview;
    this.guides = guides;
    this.bannerUrl = bannerUrl;
    this.avatarUrl = avatarUrl;
  }

  public authUser(userId: string) {
    return this.roles != null && authRoles.includes(this.roles[userId]);
  }

  public async populatedGuides() {
    const populatedGuides = [];

    for (const guideId of this.guides) {
      const guide = await AppInjector.injectClass(GuideService).getById(
        guideId.toString()
      );
      populatedGuides.push(await guide.sanitizeAsync());
    }

    return populatedGuides;
  }

  public sanitize(): SanitizedCookbook {
    return {
      id: this.id,
      game: this.game,
      name: this.name,
      streams: this.streams,
      roles: this.roles,
      preview: this.preview,
      guides: this.guides,
      bannerUrl: this.bannerUrl,
      avatarUrl: this.avatarUrl,
    };
  }

  public async sanitizeAsync(): Promise<SanitizedCookbook> {
    return {
      id: this.id,
      game: this.game,
      name: this.name,
      streams: this.streams,
      roles: this.roles,
      preview: this.preview,
      guides: await this.populatedGuides(),
      bannerUrl: this.bannerUrl,
      avatarUrl: this.avatarUrl,
    };
  }
}
