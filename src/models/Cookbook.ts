import CookbookService from "../services/CookbookService";
import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { AppInjector } from "../app";

export interface DeSerializedCookbook {
  _id?: ObjectId;
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
  name: string;
  streams?: string[];
  roles?: any;
  preview?: boolean;
  guides?: ObjectId[];
  bannerUrl?: string;
  avatarUrl?: string;
}

export class Cookbook extends BaseModel<Cookbook, SerializedCookbook> {
  public _id: ObjectId | undefined;
  public name: string;
  public streams: string[];
  public roles: string[];
  public preview;
  public guides: any[];
  public banner_url: string | undefined;
  public avatar_url: string | undefined;

  constructor({
    id,
    name,
    streams,
    roles,
    preview,
    guides,
    bannerUrl,
    avatarUrl,
  }: SerializedCookbook) {
    super(AppInjector.injectClass(CookbookService));
    this._id = id;
    this.name = name;
    this.streams = streams;
    this.roles = roles;
    this.preview = preview;
    this.guides = guides;
    this.banner_url = bannerUrl;
    this.avatar_url = avatarUrl;
  }

  public deserialize(): DeSerializedCookbook {
    return AppInjector.injectClass(CookbookService).deserialize(this);
  }

  public serialize(): SerializedCookbook {
    return AppInjector.injectClass(CookbookService).serialize({
      _id: this._id,
      name: this.name,
      streams: this.streams,
      roles: this.roles,
      preview: this.preview,
      guides: this.guides,
      banner_url: this.banner_url,
      avatar_url: this.avatar_url,
    });
  }
}
