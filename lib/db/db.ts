import { Collection, Db, MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;

// error with mongo key
if(!MONGO_URI){
    throw new Error("Something is wrong with your key");
}

export const DB_NAME = "cs601-mp-5";

export const URL_SLUG = "url-slug";

let client: MongoClient | null = null;
let db: Db | null=null;

export const clientPromise = (async () => {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client;
})();

async function connect(): Promise<Db> {
    return (await clientPromise).db(DB_NAME);
}


export default async function getCollection(collectionName: string): Promise<Collection> {
    // If `db` is not yet initialized, call `connect` to establish the connection.
    if (!db) {
        db = await connect();
    }
    // Return the requested collection from the database.
    return db.collection(collectionName);
}
