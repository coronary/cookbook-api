import SectionService from "../services/SectionService";
import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

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
    super(new SectionService());
    this._id = id;
    this.name = name;
    this.body = body;
    this.tags = tags;
  }

  public deserialize(): DeSerializedSection {
    return new SectionService().deserialize(this);
  }

  public serialize(): SerializedSection {
    return new SectionService().serialize({
      _id: this._id,
      name: this.name,
      body: this.body,
      tags: this.tags,
    });
  }
}
