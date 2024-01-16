import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";
import { User } from "./User";

export interface DeSerializedSection {
  _id: ObjectId;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
  authors: User[] | undefined | null;
}

export interface SerializedSection {
  id: ObjectId;
  creationDate: string;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
  authors: User[] | undefined | null;
}

export interface SanitizedSection {
  id: ObjectId;
  creationDate: string;
  cookbook: ObjectId;
  guide: ObjectId;
  name: string;
  body: string;
  authors: User[];
}

export function isSection(object: any): object is Section {
  const { id, name, cookbook, guide, body } = object;
  return (
    id !== undefined &&
    name !== undefined &&
    cookbook !== undefined &&
    guide !== undefined &&
    body !== undefined
  );
}

export class Section extends BaseModel {
  public id: ObjectId;
  public creationDate: string;
  public cookbook: ObjectId;
  public guide: ObjectId;
  public name: string;
  public body: string;
  public authors: User[];

  constructor(
    { id, creationDate, cookbook, guide, name, body, authors = [] }: Partial<
      SerializedSection
    >,
  ) {
    super();
    this.id = id;
    this.cookbook = cookbook;
    this.guide = guide;
    this.name = name;
    this.body = body;
    this.authors = authors;
    this.creationDate = creationDate;
  }

  public sanitize(): SanitizedSection {
    return {
      id: this.id,
      creationDate: this.creationDate,
      cookbook: this.cookbook,
      guide: this.guide,
      name: this.name,
      body: this.body,
      authors: this.authors,
    };
  }
}
