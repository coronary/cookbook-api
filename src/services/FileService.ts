import { COLLECTIONS } from "../db/db";
import { File, DeSerializedFile, SerializedFile } from "../models/File";
import { BaseService } from "./BaseService";

export default class FileService extends BaseService<File> {
  constructor() {
    super(COLLECTIONS.FILES, File);
  }

  public deserialize(model): DeSerializedFile {
    const { id, cookbook, gfyId, urls } = model;
    return {
      _id: id,
      cookbook,
      gfy_id: gfyId,
      urls,
    };
  }

  public serialize(document): SerializedFile {
    const { _id, cookbook, gify_id, urls } = document;
    return {
      id: _id,
      cookbook,
      gfyId: gify_id,
      urls,
    };
  }
}
