import type { Translations } from "@/lib/i18n/translations";

type NavKey = keyof Translations["nav"];

type NavigationData = {
  href: string;
  titleKey: NavKey;
};

export const navigationData: NavigationData[] = [
  { href: "/dashboard", titleKey: "dashboard" },
  { href: "/about", titleKey: "aboutUs" },
];
