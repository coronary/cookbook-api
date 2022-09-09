import { Strategy } from "passport-discord";

export const scopes = ["identify", "email", "guilds", "guilds.join"];
const prompt = "consent";

export default new Strategy(
  {
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: "http://localhost:3000/callback",
    scope: scopes,
    prompt: prompt,
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
);
