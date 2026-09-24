import { Metadata } from "next";
import logoImg from "@public/logo-primary-text.svg";
import logoIconImg from "@public/logo-primary.svg";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { LAYOUT_OPTIONS } from "./enums";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "Enterprise ERP",
  description:
    "Multi-tenant business operations platform: CRM, quotations and invoicing, vendor and asset registers, document management and staff administration.",
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - ${siteConfig.title}` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} - ${siteConfig.title}` : siteConfig.title,
      description,
      url: "https://app.example.com",
      siteName: siteConfig.title,
      locale: "en_US",
      type: "website",
    },
  };
};
