import { COLLECTIONS, getAll, save, getOne } from "../db/db";
import { Cookbook } from "../models/Cookbook";

export async function getCookbook(id: string): Promise<Cookbook> {
  const document = await getOne(COLLECTIONS.COOKBOOKS, id);
  return new Cookbook({ ...(document as Cookbook) });
}

export async function getAllCookbooks(): Promise<Array<Cookbook>> {
  const documents = await getAll(COLLECTIONS.COOKBOOKS);
  return documents.map((c: Cookbook) => new Cookbook({ ...c }));
}

export async function saveCookbook(params): Promise<Cookbook> {
  const { id, ...body } = params;
  const document = await save(COLLECTIONS.COOKBOOKS, id, body);
  return new Cookbook({ ...(document as Cookbook) });
}
