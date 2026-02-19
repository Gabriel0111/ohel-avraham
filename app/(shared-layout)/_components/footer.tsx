import { Logo } from "@/components/icons/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Connecting hearts and homes for a warmer Shabbat experience. Inspired
            by the hospitality of Avraham Avinu.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-foreground">Account</h4>
            <Link
              href="/sign-up"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          {"© " + new Date().getFullYear() + " Ohel Avraham. All rights reserved."}
        </p>
        <p className="text-xs text-muted-foreground">
          {"Built with "}
          <span className="text-primary">{"love"}</span>
          {" for the community"}
        </p>
      </div>
    </footer>
  );
}
