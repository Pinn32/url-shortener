// Pings the MongoDB Atlas cluster so a free (M0) cluster is not flagged as
// inactive and paused/expired. Run on a schedule via GitHub Actions.
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = "cs601-mp-5";

if (!MONGO_URI) {
    console.error("MONGO_URI is not set");
    process.exit(1);
}

const client = new MongoClient(MONGO_URI);

try {
    await client.connect();
    // An admin `ping` does not count as cluster activity for Atlas M0
    // inactivity tracking — only real reads/writes on a collection do.
    // A single upsert against a dedicated collection is the minimal
    // operation that reliably counts.
    const now = new Date();
    const result = await client
        .db(DB_NAME)
        .collection("keepalive")
        .updateOne(
            { _id: "keepalive" },
            { $set: { lastPing: now } },
            { upsert: true },
        );
    console.log(`Keepalive write OK at ${now.toISOString()}:`, result.acknowledged);
} catch (err) {
    console.error("Keepalive ping failed:", err);
    process.exitCode = 1;
} finally {
    await client.close();
}
