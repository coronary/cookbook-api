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
  async create(req, res, next) {
    super.create(req, res, next);
  }

  @superAuth()
  async deleteOne(req, res, next) {
    super.deleteOne(req, res, next);
  }

  @superAuth()
  async update(req, res, next) {
    super.update(req, res, next);
  }

  public static inject = ["gameService"] as const;
}
