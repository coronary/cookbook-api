import {
  MongoClient,
  Db,
  Collection,
  Document,
  ObjectId,
  ReturnDocument,
} from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
const DEPRICATED_DATABASE_URL = process.env.DEPRICATED_DATABASE_URL;

export const COLLECTIONS: { [collection: string]: Collection } = {
  GAMES: undefined,
  COOKBOOKS: undefined,
  USERS: undefined,
  GUIDES: undefined,
  TAGS: undefined,
  POSTS: undefined,
  SECTIONS: undefined,
  FILES: undefined,
};

export const DEPRICATED_COLLECTIONS: { [collection: string]: Collection } = {
  GAMES: undefined,
  COOKBOOKS: undefined,
  USERS: undefined,
  GUIDES: undefined,
  TAGS: undefined,
  POSTS: undefined,
};

export async function dbConnect() {
  try {
    const client: MongoClient = new MongoClient(DATABASE_URL);
    await client.connect();
    const db: Db = client.db(process.env.DB_NAME);
    COLLECTIONS.GAMES = db.collection("games");
    COLLECTIONS.COOKBOOKS = db.collection("cookbooks");
    COLLECTIONS.USERS = db.collection("users");
    COLLECTIONS.TAGS = db.collection("tags");
    COLLECTIONS.GUIDES = db.collection("guides");
    COLLECTIONS.POSTS = db.collection("posts");
    COLLECTIONS.SECTIONS = db.collection("sections");
    COLLECTIONS.FILES = db.collection("files");
    return client;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function dbConnectDepricated() {
  try {
    const client: MongoClient = new MongoClient(DEPRICATED_DATABASE_URL);
    await client.connect();
    const db: Db = client.db("core");
    DEPRICATED_COLLECTIONS.GAMES = db.collection("games");
    DEPRICATED_COLLECTIONS.COOKBOOKS = db.collection("cookbooks");
    DEPRICATED_COLLECTIONS.USERS = db.collection("users");
    DEPRICATED_COLLECTIONS.TAGS = db.collection("tags");
    DEPRICATED_COLLECTIONS.GUIDES = db.collection("guides");
    DEPRICATED_COLLECTIONS.POSTS = db.collection("posts");
    return client;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function syncDbs() {}

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
  model: any
): Promise<Document> {
  const { _id, ...body } = model;
  const filter = { _id: new ObjectId(_id) };
  const update = { $set: { ...body } };
  const options = { upsert: true, returnDocument: ReturnDocument.AFTER };

  const document = await collection.findOneAndUpdate(filter, update, options);
  return document.value;
}

export async function deleteOne(
  collection: Collection,
  id: string
): Promise<void> {
  await collection.deleteOne({ _id: new ObjectId(id) });
}

export async function getAndPopulateCookbooks(cookbookName: string) {
  return await COLLECTIONS.COOKBOOKS.aggregate([
    {
      $match: {
        $expr: {
          $eq: ["$name", cookbookName],
        },
      },
    },
    {
      $lookup: {
        from: "guides",
        localField: "guides",
        foreignField: "_id",
        as: "guides",
      },
    },
    {
      $unwind: {
        path: "$guides",
      },
    },
    {
      $lookup: {
        from: "sections",
        localField: "guides.sections",
        foreignField: "_id",
        as: "guides.sections",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: {
          $first: "$name",
        },
        avatar_url: {
          $first: "$avatar_url",
        },
        banner_url: {
          $first: "$banner_url",
        },
        game: {
          $first: "$game",
        },
        preview: {
          $first: "$preview",
        },
        roles: {
          $first: "$roles",
        },
        streams: {
          $first: "$streams",
        },
        guides: {
          $push: "$guides",
        },
      },
    },
  ]).toArray();
}
