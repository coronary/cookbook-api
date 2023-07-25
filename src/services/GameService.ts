import { COLLECTIONS } from "../db/db";
import { Game, DeSerializedGame, SerializedGame } from "../models/Game";
import { BaseService } from "./BaseService";

export default class GameService extends BaseService<Game> {
  constructor() {
    super(COLLECTIONS.GAMES, Game);
  }

  public deserialize(model): DeSerializedGame {
    const { id, name, displayName, subdomain } = model;
    return {
      _id: id,
      name: name,
      display_name: displayName,
      subdomain,
    };
  }

  public serialize(document): SerializedGame {
    const { _id, name, display_name, subdomain } = document;
    return {
      id: _id,
      name,
      displayName: display_name,
      subdomain,
    };
  }
}
