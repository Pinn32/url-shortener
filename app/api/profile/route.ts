import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { clientPromise, DB_NAME } from "@/lib/db/db";

export async function PATCH(request: Request) {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    const cleanName = typeof name === "string" ? name.trim() : "";
    if (cleanName.length < 1 || cleanName.length > 40) {
        return Response.json({ error: "Username must be between 1 and 40 characters." }, { status: 400 });
    }

    const result = await (await clientPromise).db(DB_NAME).collection("users").updateOne(
        { _id: new ObjectId(session.user.id) },
        { $set: { name: cleanName } },
    );
    if (!result.matchedCount) {
        return Response.json({ error: "User account not found." }, { status: 404 });
    }
    return Response.json({ name: cleanName });
}
