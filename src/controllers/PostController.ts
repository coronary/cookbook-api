import { ROUTES } from "../constants/Constants";
import { cookbookAuth } from "../middleware/Auth";
import { Post, SerializedPost } from "../models/Post";
import PostService from "../services/PostService";
import { BaseController } from "./BaseController";

export class PostController extends BaseController<Post, SerializedPost> {
  constructor(postService: PostService) {
    super(Post, postService, ROUTES.POSTS);
  }

  @cookbookAuth()
  async create(req, res) {
    super.create(req, res);
  }

  @cookbookAuth()
  async deleteOne(req, res) {
    super.deleteOne(req, res);
  }

  @cookbookAuth()
  async update(req, res) {
    super.update(req, res);
  }

  public static inject = ["postService"] as const;
}
