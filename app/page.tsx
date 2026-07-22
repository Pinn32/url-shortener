import { auth } from "@/auth";
import HomeClient from "@/components/HomeClient";
import getCollection, { URL_SLUG } from "@/lib/db/db";

export default async function Home() {
    const session = await auth();
    const urls = session?.user?.id
        ? await (await getCollection(URL_SLUG))
            .find({ userId: session.user.id })
            .sort({ createTime: -1 })
            .toArray()
        : [];

    return (
        <>
            <HomeClient
                user={session?.user ? {
                    name: session.user.name ?? "",
                    email: session.user.email ?? "",
                } : null}
                urls={urls.map((url) => ({
                    id: url._id.toHexString(),
                    longUrl: url.longUrl,
                    slug: url.slug,
                    description: url.description ?? "",
                    createTime: url.createTime.toISOString(),
                    updatedTime: url.updatedTime?.toISOString() ?? null,
                }))}
            />
        </>
    );
}
