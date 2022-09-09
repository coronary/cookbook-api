import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { superAuth } from "../middleware/SuperAuth";
import { User } from "../models/User";
import UserService from "../services/UserService";
import { BaseController } from "./BaseController";

export class UserController extends BaseController<User> {
  constructor() {
    super(User, new UserService(), ROUTES.USERS);
  }

  @superAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @superAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @auth()
  async update(req, res) {
    super.update(req, res);
  }
}
