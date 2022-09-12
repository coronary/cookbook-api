import express, { Application } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { CookbookController } from "../controllers/CookbookController";
import { dbConnect } from "../db/db";
import passport from "passport";
import DiscordStrategy, { scopes } from "../middleware/DiscordStrategy";
import { ROUTES } from "../constants/Constants";
import { UserController } from "../controllers/UserController";
import { handleError } from "../middleware/ErrorHandler";
import { GuideController } from "../controllers/GuideController";
import { SectionController } from "../controllers/SectionController";
import { TagController } from "../controllers/TagController";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setConfig();
    this.setControllers();
  }

  private setConfig() {
    // passport.serializeUser(function (user, done) {
    //   done(null, user);
    // });

    // passport.deserializeUser(function (user, done) {
    //   done(null, user);
    // });
    // passport.use(DiscordStrategy);
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors({ credentials: true, sameSite: "none" }));
    // this.app.use(
    //   session({
    //     secret: "keyboard cat",
    //     name: "token",
    //     cookie: { domain: "localhost", secure: false, httpOnly: false },
    //     resave: false,
    //     saveUninitialized: false,
    //   })
    // );
    // this.app.use(passport.initialize());
    // this.app.use(passport.session());
  }

  private async setControllers() {
    await dbConnect();

    const cookbookController = new CookbookController();
    const userController = new UserController();
    const guideController = new GuideController();
    const sectionController = new SectionController();
    const tagController = new TagController();

    this.app.use(`/${ROUTES.COOKBOOKS}`, cookbookController.router);
    this.app.use(`/${ROUTES.USERS}`, userController.router);
    this.app.use(`/${ROUTES.GUIDES}`, guideController.router);
    this.app.use(`/${ROUTES.SECTIONS}`, sectionController.router);
    this.app.use(`/${ROUTES.TAGS}`, tagController.router);

    // this.app.get(
    //   "/login",
    //   passport.authenticate("discord", { scope: scopes, prompt: prompt }),
    //   function (req, res) {}
    // );
    // this.app.get(
    //   "/callback",
    //   passport.authenticate("discord", { failureRedirect: "/" }),
    //   function (req: any, res) {
    //     res.redirect("/cookbooks");
    //   } // auth success
    // );
    this.app.use(handleError);
  }
}

export default new App().app;
