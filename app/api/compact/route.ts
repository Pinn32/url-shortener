import { NextRequest } from "next/server";
import shortenUrl from "@/lib/shortenUrl";
import { auth } from "@/auth";
import validateSlug from "@/lib/validateSlug";

export async function POST(req: NextRequest) {
    let { longUrl, slug } = await req.json();

    slug = typeof slug === "string" ? slug.trim().replace(/^\/+|\/+$/g, "") : "";
    if (!longUrl || !slug) {
        return Response.json({ error: "longUrl and slug are required" }, { status: 400 });
    }
    const slugError = validateSlug(slug);
    if (slugError) return Response.json({ error: slugError }, { status: 400 });

    if (!/^https?:\/\//i.test(longUrl)) {
        longUrl = "https://" + longUrl;
    }

    try {
        const session = await auth();
        const result = await shortenUrl(longUrl, slug, session?.user?.id);

        if (!result) {
            return Response.json({ error: "Failed to save to database" }, { status: 500 });
        }

        const response: { url: string; warning?: string } = {
            url: `${new URL(req.url).origin}/${result.slug}`,
        };

        if (result.originalSlug) {
            response.warning = `The slug "${result.originalSlug}" is already registered with another URL. Your link was assigned "${result.slug}" instead.`;
        }

        return Response.json(response);
    } catch (e) {
        console.error(e);
        return Response.json({ error: "Failed to save to database" }, { status: 500 });
    }
}
