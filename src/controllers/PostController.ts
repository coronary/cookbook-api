import { ROUTES } from "../constants/Constants";
import { auth } from "../middleware/Auth";
import { Post } from "../models/Post";
import PostService from "../services/PostService";
import { BaseController } from "./BaseController";

export class PostController extends BaseController<Post> {
  constructor() {
    super(Post, new PostService(), ROUTES.POSTS);
  }

  @auth()
  async create(req, res) {
    super.create(req, res);
  }

  @auth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @auth()
  async update(req, res) {
    super.update(req, res);
  }
}
