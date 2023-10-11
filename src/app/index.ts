import express, { Application } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { CookbookController } from "../controllers/CookbookController";
import { dbConnect, dbConnectDepricated } from "../db/db";
import passport from "passport";
import DiscordStrategy from "../middleware/DiscordStrategy";
import { ROUTES } from "../constants/Constants";
import { UserController } from "../controllers/UserController";
import { handleError } from "../middleware/ErrorHandler";
import { LoginController } from "../controllers/LoginController";
import MongoStore from "connect-mongo";
import { createInjector } from "typed-inject";
import CookbookService from "../services/CookbookService";
import UserService from "../services/UserService";
import GuideService from "../services/GuideService";
import PostService from "../services/PostService";
import SectionService from "../services/SectionService";
import TagService from "../services/TagService";
import { GameController } from "../controllers/GameController";
import GameService from "../services/GameService";
import FileService from "../services/FileService";
import { parseQueryStrings } from "../middleware/QueryStrings";
import { ItemFromNameController } from "../controllers/ItemFromNameController";
import RedisCache from "../db/RedisCache";

export const AppInjector = createInjector()
  .provideClass("gameService", GameService)
  .provideClass("cookbookService", CookbookService)
  .provideClass("userService", UserService)
  .provideClass("guideService", GuideService)
  .provideClass("postService", PostService)
  .provideClass("sectionService", SectionService)
  .provideClass("tagService", TagService)
  .provideClass("fileService", FileService);

const bodySizeLimit = "50mb";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setControllers();
  }

  private setConfig() {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(async function (user, done) {
      try {
        const userModel = await AppInjector.injectClass(
          UserService,
        ).getByDiscordId(user.discordId);
        done(null, userModel);
      } catch (err) {
        done(err);
      }
    });
    passport.use(DiscordStrategy);
    this.app.use(bodyParser.json({ limit: bodySizeLimit }));
    this.app.use(
      bodyParser.urlencoded({ limit: bodySizeLimit, extended: true }),
    );
    this.app.use(
      cors({
        credentials: true,
        origin: process.env.ORIGIN,
      }),
    );
    this.app.set("trust proxy", 1);

    const sessionConfig: any = {
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
      },
      store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    };

    if (!process.env.ORIGIN.includes('localhost')) {
      sessionConfig.cookie.sameSite = 'strict';
      sessionConfig.cookie.secure = true;
      sessionConfig.cookie.domain = process.env.COOKIE_DOMAIN;
    }

    this.app.use(
      session(sessionConfig),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(parseQueryStrings);
  }

  private async setControllers() {
    await dbConnect();
    await dbConnectDepricated();
    await RedisCache.connect();
    await RedisCache.flushAll();

    const loginController = AppInjector.injectClass(LoginController);
    const gameController = AppInjector.injectClass(GameController);
    const cookbookController = AppInjector.injectClass(CookbookController);
    const userController = AppInjector.injectClass(UserController);
    const itemFromNameController = AppInjector.injectClass(
      ItemFromNameController,
    );

    this.app.use(`/${ROUTES.LOGIN}`, loginController.router);
    this.app.use(`/${ROUTES.GAMES}`, gameController.router);
    this.app.use(`/${ROUTES.COOKBOOKS}`, cookbookController.router);
    this.app.use(`/${ROUTES.USERS}`, userController.router);
    this.app.use(`/${ROUTES.COOKBOOK_NAME}`, itemFromNameController.router);

    this.app.use(handleError);
  }
}

export default new App().app;
