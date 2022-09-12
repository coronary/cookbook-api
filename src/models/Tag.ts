import TagService from "../services/TagService";
import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedTag {
  _id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  color?: string;
}

export interface SerializedTag {
  id?: ObjectId;
  name: string;
  cookbook: ObjectId;
  color?: string;
}

export class Tag extends BaseModel<Tag, SerializedTag> {
  public _id: ObjectId | undefined;
  public name: string;
  public cookbook: ObjectId;
  public color: string | null | undefined;

  constructor({ id, name, cookbook, color }: SerializedTag) {
    super(new TagService());
    this._id = id;
    this.name = name;
    this.cookbook = cookbook;
    this.color = color;
  }

  public deserialize(): DeSerializedTag {
    return new TagService().deserialize(this);
  }

  public serialize(): SerializedTag {
    return new TagService().serialize({
      _id: this._id,
      name: this.name,
      cookbook: this.cookbook,
      color: this.color,
    });
  }
}
