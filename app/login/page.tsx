import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function LoginPage() {
    if (await auth()) redirect("/");

    return (
        <section className="login-panel">
            <Link className="back-link" href="/">Back to shortener</Link>
            <h1>Log in</h1>
            <p>Use Google to save, describe, rename, and delete your shortened URLs.</p>
            <form action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
            }}>
                <button className="google-button" type="submit">Continue with Google</button>
            </form>
            <p className="guest-note">You can keep using the shortener as a guest without logging in.</p>
        </section>
    );
}
