"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import { navigationData } from "@/lib/navigation-data";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { Logo } from "@/components/icons/logo";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AvatarDropdown from "@/components/ui/avatar-dropdown";
import { useAuth } from "@/app/ConvexClientProvider";
import { SearchTriggerButton } from "@/components/search/search-trigger";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";

const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: "en", label: "EN", flag: "🇬🇧" },
  { value: "fr", label: "FR", flag: "🇫🇷" },
  { value: "he", label: "HE", flag: "🇮🇱" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang, setLang } = useT();

  const currentLang = LANGUAGES.find((l) => l.value === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success(t.common.logoutSuccess);
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm"
          : "bg-transparent",
      )}
    >
      <nav className="relative mx-auto flex h-16 max-w-7xl items-center w-full px-4 md:px-8 lg:px-12">
        {/* Logo — left */}
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        {/* Navigation — truly centered via absolute positioning */}
        <NavigationMenu className="absolute left-1/2 -translate-x-1/2 max-md:hidden">
          <NavigationMenuList className="gap-1">
            {navigationData.map((navItem) => {
              const item = (
                <NavigationMenuItem key={navItem.titleKey}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors hover:bg-transparent"
                  >
                    {t.nav[navItem.titleKey]}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
              return navItem.requiresAuth ? (
                <Authenticated key={navItem.titleKey}>{item}</Authenticated>
              ) : (
                item
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side controls — ms-auto pour gérer LTR et RTL */}
        <div className="ms-auto flex items-center gap-1.5">
          <SearchTriggerButton />
          <AnimatedThemeToggler />

          {/* Language selector — DropdownMenu for full styling control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <ChevronDown className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-27.5 z-100">
              {LANGUAGES.map((l) => (
                <DropdownMenuItem
                  key={l.value}
                  onSelect={() => setLang(l.value)}
                  className={cn(
                    "gap-2 cursor-pointer text-sm",
                    lang === l.value && "text-primary font-semibold",
                  )}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {lang === l.value && (
                    <Check className="size-3 ml-auto text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Authenticated>
            <AvatarDropdown
              name={user?.name}
              email={user?.email}
              imageSrc={user?.image}
              items={[
                {
                  icon: <UserIcon />,
                  label: t.nav.profile,
                  onClick: () => router.push("/dashboard/profile"),
                },
                {
                  icon: <LogOutIcon />,
                  label: t.nav.signOut,
                  onClick: onSignOut,
                  variant: "destructive",
                },
              ]}
            />
          </Authenticated>

          <Unauthenticated>
            <div className="flex items-center gap-1.5 max-md:hidden">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                {t.nav.login}
              </Link>
              <Link href="/sign-up" className={buttonVariants({ size: "sm" })}>
                {t.nav.signup}
              </Link>
            </div>
          </Unauthenticated>

          <AuthLoading>
            <Button variant="ghost" size="sm" disabled>
              <Spinner />
            </Button>
          </AuthLoading>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="size-4" />
                  <span className="sr-only">{t.nav.menu}</span>
                </Button>
              </SheetTrigger>
              <SheetTitle className="hidden">
                <p>{t.nav.menu}</p>
              </SheetTitle>
              <SheetContent side="right" className="w-64 p-5">
                <nav className="flex flex-col gap-3 mt-8">
                  {navigationData.map((item) => {
                    const link = (
                      <Link
                        key={item.titleKey}
                        href={item.href}
                        className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-1"
                      >
                        {t.nav[item.titleKey]}
                      </Link>
                    );
                    return item.requiresAuth ? (
                      <Authenticated key={item.titleKey}>{link}</Authenticated>
                    ) : (
                      link
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                    <Unauthenticated>
                      <>
                        <Link
                          href="/login"
                          className={buttonVariants({ variant: "outline" })}
                        >
                          {t.nav.login}
                        </Link>
                        <Link href="/sign-up" className={buttonVariants()}>
                          {t.nav.signup}
                        </Link>
                      </>
                    </Unauthenticated>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
