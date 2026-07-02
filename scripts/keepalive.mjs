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
    // A trivial admin command counts as activity against the cluster.
    const result = await client.db(DB_NAME).command({ ping: 1 });
    console.log(`Ping OK at ${new Date().toISOString()}:`, result);
} catch (err) {
    console.error("Keepalive ping failed:", err);
    process.exitCode = 1;
} finally {
    await client.close();
}
