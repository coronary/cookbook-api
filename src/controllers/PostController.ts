import { ROUTES } from "../constants/Constants";
import { Post } from "../models/Post";
import PostService from "../services/PostService";
import { CookbookBaseController } from "./CookbookBaseController";

export class PostController extends CookbookBaseController<Post> {
  constructor(postService: PostService) {
    super(Post, postService, ROUTES.POSTS);
  }

  public static inject = ["postService"] as const;
}
