import { ObjectId } from "mongodb";
import qs from "qs";

export const parseQueryStrings = (req, res, next) => {
  const query = req.query ?? {};
  query.filters = query.filters ?? {};
  query.filters = parseObjectIds(qs.parse(query.filters));
  req.query = query;
  next();
};

export function parseObjectIds(query) {
  Object.keys(query).forEach(function (key) {
    if (ObjectId.isValid(query[key])) query[key] = new ObjectId(query[key]);
  });
  return query;
}
