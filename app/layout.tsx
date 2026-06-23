import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import type React from "react";
import "./globals.css";

// Google fonts
const quantico = Quantico({
    weight: ["400", "700"],
    variable: "--font-quantico",
    subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
    title: "mp-5 | CS601",
    description: "Next.js App: URL Shortener",
};

// RootLayout
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <html lang="en" className={`${quantico.variable}`}>
                <body>
                    <main>
                        {children}
                    </main>
                    <footer>
                        © {new Date().getFullYear()} Pinn Xu. All rights reserved.
                    </footer>
                </body>
            </html>
        </>
    );
}
