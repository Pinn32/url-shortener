const RESERVED_SEGMENTS = new Set(["api", "login", "icon.svg"]);

export default function validateSlug(slug: string): string | null {
    if (slug.length < 1 || slug.length > 100) return "Slug must be between 1 and 100 characters.";
    if (!/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(slug)) {
        return "Slug can only contain letters, numbers, hyphens, underscores, and slashes.";
    }
    if (RESERVED_SEGMENTS.has(slug.split("/")[0].toLowerCase())) return "That slug is reserved by the application.";
    return null;
}
