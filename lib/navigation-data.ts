import type { Translations } from "@/lib/i18n/translations";

type NavKey = keyof Translations["nav"];

type NavigationData = {
  href: string;
  titleKey: NavKey;
  requiresAuth?: boolean;
};

export const navigationData: NavigationData[] = [
  { href: "/dashboard", titleKey: "dashboard", requiresAuth: true },
  { href: "/about", titleKey: "aboutUs" },
  { href: "/contact", titleKey: "contact" },
];
