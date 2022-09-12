import { Strategy } from "passport-discord";
import { AppInjector } from "../app";
import { User } from "../models/User";
import UserService from "../services/UserService";

export const scopes = ["identify", "email", "guilds", "guilds.join"];
export const prompt = "consent";

export default new Strategy(
  {
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: "http://localhost:3000/login/callback",
    scope: scopes,
    prompt: prompt,
  },
  async function (accessToken, refreshToken, profile, next) {
    try {
      const userService = AppInjector.injectClass(UserService);
      const existingUsers = await userService.get({ discord_id: profile.id });
      const existingUser = existingUsers[0];

      const u = new User({
        id: existingUser?.id,
        discordId: profile.id,
        discordUsername: profile.username,
        discordAvatar: profile.avatar,
        discordDiscriminator: profile.discriminator,
      });
      const savedUser = await u.save();

      return next(null, savedUser);
    } catch (err) {
      return next(err);
    }
  }
);
