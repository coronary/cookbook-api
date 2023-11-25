import { ObjectId } from "mongodb";
import qs from "qs";

const VALID_OBJECT_ID_KEYS = [
  "game",
  "guide",
  "cookbook",
  "section",
  "user",
  "tag",
];

export const parseQueryStrings = (req, res, next) => {
  const query = req.query ?? {};
  const parsedFilters = qs.parse(query.filters);
  query.filters = query.filters ?? {};
  query.options = query.options ?? {};
  query.filters = parseObjectIds(parsedFilters);
  query.filters = parseBooleans(query.filters);
  req.query = query;
  next();
};

export function parseObjectIds(query) {
  const keys = Object.keys(query);

  for (const key of keys) {
    if (VALID_OBJECT_ID_KEYS.includes(key)) {
      if (ObjectId.isValid(query[key])) query[key] = new ObjectId(query[key]);
    }
  }

  return query;
}

export function parseBooleans(query) {
  const keys = Object.keys(query);

  for (const key of keys) {
    const isBoolean = query[key] === "false" || query[key] === "true";

    if (isBoolean) {
      query[key] = query[key] === true;
    }
  }

  return query;
}
