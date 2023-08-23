import { ObjectId } from "mongodb";
import qs from "qs";

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
  Object.keys(query).forEach(function (key) {
    if (ObjectId.isValid(query[key])) query[key] = new ObjectId(query[key]);
  });
  return query;
}

export function parseBooleans(query) {
  Object.keys(query).forEach(function (key) {
    if (query[key] === "false" || query[key] === "true")
      query[key] = query[key] === true;
  });
  return query;
}
