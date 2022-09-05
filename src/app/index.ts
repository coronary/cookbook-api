import express, { Application } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { CookbookController } from "../controllers/CookbookController";
import { dbConnect } from "../db/db";
import passport from "passport";
import { Strategy } from "passport-discord";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const scopes = ["identify", "email", "guilds", "guilds.join"];
const prompt = "consent";

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
    passport.use(
      new Strategy(
        {
          clientID: "959550757164703764",
          clientSecret: "ixawKFJyAdFTGjGROjp4TBBYjZpj3GEg",
          callbackURL: "http://localhost:3000/callback",
          scope: scopes,
          prompt: prompt,
        },
        function (accessToken, refreshToken, profile, done) {
          process.nextTick(function () {
            return done(null, profile);
          });
        }
      )
    );
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: "50mb" }));
    // this.app.use(cookieParser());
    // Allows us to receive requests with data in x-www-form-urlencoded format
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    // Enables cors
    this.app.use(cors({ credentials: true, sameSite: "none" }));
    this.app.use(
      session({
        secret: "keyboard cat",
        name: "token",
        cookie: { domain: "localhost", secure: false, httpOnly: false }, // <- THIS, set domain as 'app.com'
        resave: false,
        saveUninitialized: false,
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private async setControllers() {
    await dbConnect();

    const cookbookController = new CookbookController();
    this.app.use("/cookbooks", cookbookController.router);
    this.app.get(
      "/login",
      passport.authenticate("discord", { scope: scopes, prompt: prompt }),
      function (req, res) {}
    );
    this.app.get(
      "/callback",
      passport.authenticate("discord", { failureRedirect: "/" }),
      function (req: any, res) {
        res.redirect("/cookbooks");
      } // auth success
    );
  }
}

export default new App().app;
