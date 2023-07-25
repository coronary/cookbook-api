import { ROUTES } from "../constants/Constants";
import { superAuth } from "../middleware/SuperAuth";
import { Game } from "../models/Game";
import GameService from "../services/GameService";
import { BaseController } from "./BaseController";

export class GameController extends BaseController<Game> {
  constructor(gameService: GameService) {
    super(Game, gameService, ROUTES.GAMES);
  }

  @superAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @superAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @superAuth()
  async update(req, res) {
    super.update(req, res);
  }

  public static inject = ["gameService"] as const;
}
