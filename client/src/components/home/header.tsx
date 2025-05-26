"use client";

import Link from "next/link";
import { Star, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <header className="fixed top-0 z-50 w-full bg-background-primary text-white px-6 py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <Star className="text-primary" size={20} />
                    <span className="text-xl font-bold">The Future of Man</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`cursor-pointer hover:text-primary-text ${
                                isActive(link.href)
                                    ? "text-primary font-semibold"
                                    : ""
                            }`}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <Link
                    href="/quiz"
                    className="hidden md:inline-block bg-primary text-background-primary px-6 py-2 rounded-full font-semibold hover:bg-primary-text transition-colors cursor-pointer">
                    Take the Quiz
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu">
                    {menuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Items */}
            {menuOpen && (
                <div className="md:hidden mt-4 px-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block hover:text-primary-text ${
                                isActive(link.href)
                                    ? "text-primary font-semibold"
                                    : ""
                            }`}>
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/quiz"
                        className="block bg-primary text-background-primary px-4 py-2 rounded-full font-semibold hover:bg-primary-text transition-colors text-center">
                        Take the Quiz
                    </Link>
                </div>
            )}
        </header>
    );
};

export { Header };
