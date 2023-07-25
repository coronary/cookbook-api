import { ObjectId } from "mongodb";
import { BaseModel } from "./BaseModel";

export interface DeSerializedGame {
  _id?: ObjectId;
  name: string;
  display_name: string;
  subdomain: string;
}

export interface SerializedGame {
  id?: ObjectId;
  name: string;
  displayName: string;
  subdomain: string;
}

export interface SanitizedGame {
  id: ObjectId;
  name: string;
  displayName: string;
  subdomain: string;
}

export class Game extends BaseModel {
  public id: ObjectId | undefined;
  public name: string;
  public displayName: string;
  public subdomain: string;

  constructor({ id, name, displayName, subdomain }: SerializedGame) {
    super();
    this.id = id;
    this.name = name;
    this.displayName = displayName;
    this.subdomain = subdomain;
  }

  public sanitize(): SanitizedGame {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      subdomain: this.subdomain,
    };
  }
}
