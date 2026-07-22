"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Title from "@/components/Title";
import Shortener from "@/components/Shortener";
import Output from "@/components/Output";
import UrlManager, { ManagedUrl } from "@/components/UrlManager";

type Result =
    | { type: "success"; url: string; warning?: string }
    | { type: "error"; message: string };

export default function HomeClient({ user, urls }: {
    user: { name: string; email: string } | null;
    urls: ManagedUrl[];
}) {
    const [result, setResult] = useState<Result | null>(null);
    const router = useRouter();

    return (
        <>
            <Title />
            {!user && (
                <p className="login-prompt">
                    Log in to store and manage all your shortened URLs. You can also continue as a guest.
                </p>
            )}
            <Shortener onResult={(nextResult) => {
                setResult(nextResult);
                if (nextResult.type === "success" && user) router.refresh();
            }} />
            {result && <Output result={result} />}
            {user && <UrlManager initialName={user.name} email={user.email} urls={urls} />}
        </>
    );
}
