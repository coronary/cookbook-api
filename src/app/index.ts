import express, { Application } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { CookbookController } from "../controllers/CookbookController";
import { dbConnect } from "../db/db";
import passport from "passport";
import DiscordStrategy from "../middleware/DiscordStrategy";
import { ROUTES } from "../constants/Constants";
import { UserController } from "../controllers/UserController";
import { handleError } from "../middleware/ErrorHandler";
import { GuideController } from "../controllers/GuideController";
import { SectionController } from "../controllers/SectionController";
import { TagController } from "../controllers/TagController";
import { LoginController } from "../controllers/LoginController";
import MongoStore from "connect-mongo";

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

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });
    passport.use(DiscordStrategy);
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors({ credentials: true, sameSite: "none" }));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private async setControllers() {
    await dbConnect();

    const loginController = new LoginController();
    const cookbookController = new CookbookController();
    const userController = new UserController();
    const guideController = new GuideController();
    const sectionController = new SectionController();
    const tagController = new TagController();

    this.app.use(`/${ROUTES.LOGIN}`, loginController.router);
    this.app.use(`/${ROUTES.COOKBOOKS}`, cookbookController.router);
    this.app.use(`/${ROUTES.USERS}`, userController.router);
    this.app.use(`/${ROUTES.GUIDES}`, guideController.router);
    this.app.use(`/${ROUTES.SECTIONS}`, sectionController.router);
    this.app.use(`/${ROUTES.TAGS}`, tagController.router);

    this.app.use(handleError);
  }
}

export default new App().app;
