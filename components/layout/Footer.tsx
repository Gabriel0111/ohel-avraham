import { Logo } from "@/components/icons/logo";
import Link from "next/link";

const footerLinks = {
  main: [
    { label: "About", href: "#about" },
    { label: "Community Guidelines", href: "#guidelines" },
    { label: "Frequently Asked Questions", href: "#faq" },
    { label: "Contact", href: "#contact" },
    { label: "Terms & Privacy", href: "#terms" },
  ],
};

const Footer = () => {
  return (
    <footer className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Logo & Mission */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo />
          </div>
          <p className=" text-sm max-w-md mx-auto">
            Created to strengthen kindness and unity within Israel
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
          {footerLinks.main.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className=" hover:text-primary transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-primary/10 mb-6" />

        {/* Copyright */}
        <p className="text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Ohel Avraham. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
