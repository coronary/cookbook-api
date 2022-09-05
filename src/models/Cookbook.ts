import {
  getAllCookbooks,
  getCookbook,
  saveCookbook,
} from "../services/cookbook";
import { ObjectId } from "mongodb";
import { ModelType } from "./Model.types";

export interface ICookbook {
  _id?: ObjectId;
  name: string;
  streams?: string[];
  roles?: any;
  preview?: boolean;
  guides?: ObjectId[];
  banner_url?: string;
}

export class Cookbook implements ModelType {
  public _id: ObjectId | undefined;
  public name: string;
  public streams: string[] = [];
  public roles: string[] = [];
  public preview = false;
  public guides: any[] = [];
  public banner_url: string | undefined = undefined;

  constructor(options: ICookbook) {
    const { _id, name, streams, preview, guides, banner_url } = options;
    this._id = _id;
    this.name = name;
    this.streams = streams || this.streams;
    this.preview = preview != null ? preview : this.preview;
    this.guides = guides || this.guides;
    this.banner_url = banner_url || this.banner_url;
  }

  async save() {
    await saveCookbook(this.serialize());
  }

  static async getOne(id: string): Promise<Cookbook> {
    return getCookbook(id);
  }
  static async getAll(): Promise<Array<Cookbook>> {
    return getAllCookbooks();
  }

  serialize() {
    return {
      id: this._id,
      name: this.name,
      streams: this.streams,
      preview: this.preview,
      guides: this.guides,
      bannerUrl: this.banner_url,
    };
  }
}
