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

  const handleLinkClick = () => {
    setMenuOpen(false); // close mobile menu on navigation
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-background-primary text-white px-6 py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2"
        >
          <Star className="text-highlight-text" size={20} />
          <span className="text-xl font-bold">The Future of Man</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`transition-colors hover:text-tertiary-text ${
                isActive(link.href) ? "text-highlight-text font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/quiz"
          className="hidden md:inline-block bg-background-button text-button-text px-6 py-2 rounded-full font-semibold hover:bg-background-button-hover hover:text-button-text-hover transition-colors"
        >
          Take the Quiz
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-6 space-y-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`block transition-colors hover:text-tertiary-text ${
                isActive(link.href) ? "text-highlight-text font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/quiz"
            onClick={handleLinkClick}
            className="block bg-background-button text-button-text px-4 py-2 rounded-full font-semibold hover:bg-background-button-hover hover:text-button-text-hover transition-colors text-center"
          >
            Take the Quiz
          </Link>
        </div>
      )}
    </header>
  );
};

export { Header };
