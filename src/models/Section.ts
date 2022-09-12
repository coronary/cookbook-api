import SectionService from "../services/SectionService";
import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { AppInjector } from "../app";

export interface DeSerializedSection {
  _id?: ObjectId;
  name: string;
  body: string;
  tags: ObjectId[];
}

export interface SerializedSection {
  id?: ObjectId;
  name: string;
  body: string;
  tags: ObjectId[];
}

export class Section extends BaseModel<Section, SerializedSection> {
  public _id: ObjectId | undefined;
  public name: string;
  public body: string;
  public tags: ObjectId[];

  constructor({ id, name, body, tags }: SerializedSection) {
    super(AppInjector.injectClass(SectionService));
    this._id = id;
    this.name = name;
    this.body = body;
    this.tags = tags;
  }

  public deserialize(): DeSerializedSection {
    return AppInjector.injectClass(SectionService).deserialize(this);
  }

  public serialize(): SerializedSection {
    return AppInjector.injectClass(SectionService).serialize({
      _id: this._id,
      name: this.name,
      body: this.body,
      tags: this.tags,
    });
  }
}
