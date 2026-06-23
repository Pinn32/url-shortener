import type { Metadata } from "next";
import { Quantico } from "next/font/google";
import type React from "react";
import "./globals.css";
import Footer from "@/components/Footer";

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
                    <Footer/>
                </body>
            </html>
        </>
    );
}
