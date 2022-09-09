import { MongoClient, Db, Collection, Document, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;

export const COLLECTIONS: { COOKBOOKS: Collection; USERS: Collection } = {
  COOKBOOKS: undefined,
  USERS: undefined,
};

export async function dbConnect() {
  try {
    const client: MongoClient = new MongoClient(DATABASE_URL);
    await client.connect();
    const db: Db = client.db(process.env.DB_NAME);
    COLLECTIONS.COOKBOOKS = db.collection("cookbooks");
    COLLECTIONS.USERS = db.collection("users");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function getById(
  collection: Collection,
  id: string
): Promise<Document> {
  const filter = { _id: new ObjectId(id) };
  const documents = await collection.find(filter).toArray();
  return documents[0];
}

export async function get(
  collection: Collection,
  filter = {}
): Promise<Array<Document>> {
  return collection.find(filter).toArray();
}

export async function save(
  collection: Collection,
  id: string,
  body: any
): Promise<Document> {
  const filter = { _id: new ObjectId(id) };
  const update = { $set: { ...body } };
  const options = { upsert: true, returnDocument: "after" };
  // @ts-expect-error
  const document = await collection.findOneAndUpdate(filter, update, options);
  // @ts-expect-error
  return document.value;
}

export async function deleteOne(
  collection: Collection,
  id: string
): Promise<void> {
  await collection.deleteOne({ _id: new ObjectId(id) });
}
