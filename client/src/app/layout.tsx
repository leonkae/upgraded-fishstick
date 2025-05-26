import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "The Future of Man",
    description:
        "A fun and introspective quiz to help you discover your destiny: Heaven, Hell, or In-Between.",
    icons: {
        icon: "/favicon.ico",
    },
    openGraph: {
        title: "The Future of Man",
        description:
            "Take the quiz to discover your fate: Heaven, Hell, or In-Between.",
        // url: "https://yourdomain.com",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <body
                className={`${geistSans.variable} ${geistMono.variable} min-h-screen`}>
                {children}
                <Toaster position="bottom-center" richColors duration={5000} />
            </body>
        </html>
    );
}
