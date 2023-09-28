import { Router } from "express";
import { logRoutes } from "../utils/Logging";
import passport from "passport";
import { prompt, scopes } from "../middleware/DiscordStrategy";
import { ROUTES } from "../constants/Constants";

const DISCORD = "discord";

export class LoginController {
  public router = Router();
  public route = ROUTES.LOGIN;

  constructor() {
    this.setRoutes = this.setRoutes.bind(this);
    this.setRoutes();
    logRoutes(`/${this.route}`, this.router);
  }

  setRoutes() {
    this.router.get(
      "/",
      passport.authenticate(DISCORD, { scope: scopes, prompt: prompt }),
    );
    this.router.get(
      "/callback",
      passport.authenticate(DISCORD, { failureRedirect: "/" }),
      this.redirect,
    );
    this.router.get("/success", this.getCurrentUser);
  }

  redirect(req, res) {
    res.redirect(process.env.ORIGIN);
  }

  getCurrentUser(req, res, next) {
    res.send(req.user);
  }
}
