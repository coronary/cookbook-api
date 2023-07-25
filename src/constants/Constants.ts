export const ROUTES = {
  GAMES: "games",
  COOKBOOKS: "cookbooks",
  USERS: "users",
  GUIDES: "guides",
  SECTIONS: "sections",
  TAGS: "tags",
  POSTS: "posts",
  LOGIN: "login",
};

export const MediaRoutes = {
  CHARACTER_ICON: (game: string, character: string) =>
    `https://media.cookbook.gg/${game}/${character}.png`,
};
