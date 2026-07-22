import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import type React from "react";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/Footer";
import { auth, signOut } from "@/auth";

// Google fonts
const quantico = Quantico({
    weight: ["400", "700"],
    variable: "--font-quantico",
    subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
    title: "URL Shortener | Pinn32",
    description: "Next.js App: URL Shortener, developed by Pinn Xu.",
};

// RootLayout
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <>
            <html lang="en" className={`${quantico.variable}`}>
                <body>
                    <header className="account-bar">
                        {session?.user ? (
                            <>
                                <span>{session.user.name ?? session.user.email}</span>
                                <form action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/" });
                                }}>
                                    <button className="secondary-button" type="submit">Log out</button>
                                </form>
                            </>
                        ) : <Link className="login-link" href="/login">Log in</Link>}
                    </header>
                    <main>
                        {children}
                    </main>
                    <Footer/>
                </body>
            </html>
        </>
    );
}
