import { MongoClient, Db, Collection, Document, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;

export const COLLECTIONS: { COOKBOOKS: Collection } = {
  COOKBOOKS: undefined,
};

export async function dbConnect() {
  try {
    const client: MongoClient = new MongoClient(DATABASE_URL);
    await client.connect();
    const db: Db = client.db(process.env.DB_NAME);
    COLLECTIONS.COOKBOOKS = db.collection("cookbooks");
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function getOne(
  collection: Collection,
  id: string
): Promise<Document> {
  try {
    const documents = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return documents[0];
  } catch {
    console.error("Failed to get one");
  }
}

export async function getAll(collection: Collection): Promise<Array<Document>> {
  try {
    return collection.find({}).toArray();
  } catch {
    console.error("Failed to get all");
  }
}

export async function save(
  collection: Collection,
  id: ObjectId,
  body: any
): Promise<Document> {
  try {
    return collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body } },
      { upsert: true }
    );
  } catch {
    console.error("Failed to save");
  }
}
