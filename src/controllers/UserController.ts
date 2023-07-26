import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { User } from "../models/User";
import UserService from "../services/UserService";
import { BaseController } from "./BaseController";

export class UserController extends BaseController<User> {
  constructor(userService: UserService) {
    super(User, userService, ROUTES.USERS);
  }

  @superAuth()
  async create(req, res, next) {
    super.create(req, res, next);
  }

  @superAuth()
  async deleteOne(req, res, next) {
    super.deleteOne(req, res, next);
  }

  @cookbookAuth()
  async update(req, res, next) {
    super.update(req, res, next);
  }

  public static inject = ["userService"] as const;
}
