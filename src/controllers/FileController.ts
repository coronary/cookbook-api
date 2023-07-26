import { ROUTES } from "../constants/Constants";
import { cookbookId } from "../middleware/CookbookId";
import { tryCatch } from "../middleware/ErrorHandler";
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
  @tryCatch()
  async getRandomGif(req, res, next) {
    const { cookbook } = req.body;
    const files = await this.service.get({ cookbook });

    res.send(files[Math.floor(Math.random() * files.length)]);
  }

  public static inject = ["fileService"] as const;
}
