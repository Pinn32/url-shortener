import { UrlProps } from "@/lib/db/types";
import getCollection, {URL_SLUG} from "@/lib/db/db";

export type ShortenResult = UrlProps & { originalSlug?: string };

export default async function shortenUrl(longUrl: string, slug: string, userId?: string): Promise<ShortenResult | null> {
    const urlCollection = await getCollection(URL_SLUG);

    // Exact match: same URL and slug already exists
    const exactMatch = await urlCollection.findOne({ longUrl, slug, userId });
    if (exactMatch) {
        return { id: exactMatch._id.toHexString(), longUrl, slug, createTime: exactMatch.createTime };
    }

    // Find an available slug (the requested one, or slug/01, slug/02, ...)
    let finalSlug = slug;
    const takenByOther = await urlCollection.findOne({ slug, longUrl: { $ne: longUrl } });

    if (takenByOther) {
        let counter = 1;
        while (true) {
            const candidate = `${slug}/${String(counter).padStart(2, "0")}`;
            const conflict = await urlCollection.findOne({ slug: candidate, longUrl: { $ne: longUrl } });
            if (!conflict) {
                // Also check if this candidate already maps our exact URL
                const ownMatch = await urlCollection.findOne({ slug: candidate, longUrl });
                if (ownMatch) {
                    return {
                        id: ownMatch._id.toHexString(),
                        longUrl,
                        slug: candidate,
                        createTime: ownMatch.createTime,
                        originalSlug: slug,
                    };
                }
                finalSlug = candidate;
                break;
            }
            counter++;
        }
    }

    const createTime = new Date();
    const res = await urlCollection.insertOne({ longUrl, slug: finalSlug, createTime, ...(userId ? { userId } : {}) });

    if (!res.acknowledged) {
        return null;
    }

    return {
        id: res.insertedId.toHexString(),
        longUrl,
        slug: finalSlug,
        createTime,
        userId,
        ...(finalSlug !== slug ? { originalSlug: slug } : {}),
    };
}
