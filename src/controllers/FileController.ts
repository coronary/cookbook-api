import { ObjectId } from "mongodb";
import { ROUTES } from "../constants/Constants";
import { cookbookId } from "../middleware/CookbookId";
import { File } from "../models/File";
import FileService from "../services/FileService";
import { CookbookBaseController } from "./CookbookBaseController";

export class FileController extends CookbookBaseController<File> {
  constructor(guideService: FileService) {
    super(File, guideService, ROUTES.FILES);
    this.setRoutes();
  }

  setRoutes() {
    this.router.get("/random", this.getRandomGif);
    super.setRoutes();
  }

  @cookbookId()
  async getRandomGif(req, res) {
    const { cookbook } = req.body;
    const files = await this.service.get({ cookbook: new ObjectId(cookbook) });
    res.send(files[Math.floor(Math.random() * files.length)]);
  }

  public static inject = ["fileService"] as const;
}
