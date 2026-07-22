"use client";

import { useState } from "react";
import {
    StyledSection,
    StyledDiv,
    StyledInput,
    StyledSlugDiv,
    StyledFlexInput,
    StyledButton,
} from "./ShortenerStyles";

type Result =
    | { type: "success"; url: string; warning?: string }
    | { type: "error"; message: string };

interface ShortenerProps {
    onResult: (result: Result) => void;
}

const API_ERROR_MESSAGES: Record<string, string> = {
    "longUrl and slug are required": "Long URL and slug are required.",
    "Failed to save to database": "Something went wrong. Please try again.",
    "Invalid URL": "Please enter a valid URL.",
};

function humanizeError(raw: string): string {
    return API_ERROR_MESSAGES[raw] ?? raw ?? "An unexpected error occurred. Please try again.";
}

export default function Shortener({ onResult }: ShortenerProps) {
    const [longUrl, setLongUrl] = useState("");
    const [slug, setSlug] = useState("");

    function isValidUrl(input: string): boolean {
        const normalized = /^https?:\/\//i.test(input) ? input : "https://" + input;
        try {
            const { hostname } = new URL(normalized);
            return hostname.includes(".");
        } catch {
            return false;
        }
    }

    async function handleClick() {
        if (!isValidUrl(longUrl)) {
            onResult({ type: "error", message: humanizeError("Invalid URL") });
            return;
        }
        try {
            const res = await fetch("/api/compact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ longUrl, slug }),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                onResult({ type: "error", message: humanizeError(body.error) });
                return;
            }
            const { url, warning } = await res.json();
            onResult({ type: "success", url, warning });
        } catch (e) {
            console.error(e);
            onResult({ type: "error", message: "Could not reach the server. Check your connection and try again." });
        }
    }

    return(
        <StyledSection id="shortener">
            <StyledDiv>
                <label htmlFor="long-url">
                    Enter your long URL:
                </label>
                <StyledInput
                    id="long-url"
                    placeholder="https://example.com/long/url/"
                    value={longUrl}
                    onChange={e => setLongUrl(e.target.value)}
                />
            </StyledDiv>

            <StyledDiv>
                <label htmlFor="slug">
                    Enter a slug for your short URL:
                </label>
                <StyledSlugDiv>
                    <p>https://url-to.vercel.app/</p>
                    <StyledFlexInput
                        id="slug"
                        placeholder="your-slug"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleClick()}
                    />
                    <StyledButton onClick={handleClick}>Click to Compact</StyledButton>
                </StyledSlugDiv>
            </StyledDiv>
        </StyledSection>
    )
}
