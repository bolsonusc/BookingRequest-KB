import type socialIcons from "@assets/socialIcons";

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  scheduledPostMargin: number;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

// Knowledge Base Types
export type DocCategory = "getting-started" | "guides" | "reference" | "faq";

export type CategoryMeta = {
  label: string;
  order: number;
  icon?: string;
  description?: string;
  collapsed?: boolean;
};

export type NavigationItem = {
  title: string;
  href?: string;
  icon?: string;
  order: number;
  category?: DocCategory;
  children?: NavigationItem[];
  isActive?: boolean;
  badge?: "new" | "beta" | "deprecated" | "";
};

export type DocsFrontmatter = {
  title: string;
  description: string;
  category: DocCategory;
  order: number;
  draft?: boolean;
  lastUpdated?: Date;
  sidebar?: {
    label?: string;
    icon?: string;
    badge?: "new" | "beta" | "deprecated" | "";
  };
  ogImage?: string;
  canonicalURL?: string;
};

export type ServiceFrontmatter = {
  title: string;
  description: string;
  price: string;
  duration?: string;
  priceType: "hourly" | "flat" | "custom";
  features: string[];
  bookingUrl: string;
  order: number;
  highlighted?: boolean;
  availability?: string;
};
