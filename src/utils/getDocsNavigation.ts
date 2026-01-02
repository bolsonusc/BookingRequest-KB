import { getCollection } from "astro:content";
import type { NavigationItem, DocCategory, CategoryMeta } from "@/types";

// Category metadata with display labels and order
export const CATEGORY_META: Record<DocCategory, CategoryMeta> = {
  "getting-started": {
    label: "Getting Started",
    order: 1,
    icon: "rocket",
    description: "Quick start guides and introduction",
  },
  guides: {
    label: "Guides",
    order: 2,
    icon: "book",
    description: "In-depth tutorials and how-tos",
  },
  reference: {
    label: "Reference",
    order: 3,
    icon: "code",
    description: "API documentation and specifications",
  },
  faq: {
    label: "FAQ",
    order: 4,
    icon: "question",
    description: "Frequently asked questions",
  },
};

export async function getDocsNavigation(
  currentPath?: string
): Promise<NavigationItem[]> {
  const docs = await getCollection("docs", ({ data }) => !data.draft);

  // Group docs by category
  const grouped = docs.reduce(
    (acc, doc) => {
      const category = doc.data.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    },
    {} as Record<DocCategory, typeof docs>
  );

  // Build navigation tree
  const navigation: NavigationItem[] = Object.entries(CATEGORY_META)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([category, meta]) => {
      const categoryDocs = grouped[category as DocCategory] || [];
      const sortedDocs = categoryDocs.sort(
        (a, b) => a.data.order - b.data.order
      );

      return {
        title: meta.label,
        icon: meta.icon,
        order: meta.order,
        category: category as DocCategory,
        children: sortedDocs.map(doc => ({
          title: doc.data.sidebar?.label || doc.data.title,
          href: `/docs/${doc.slug}/`,
          order: doc.data.order,
          badge: doc.data.sidebar?.badge,
          isActive: currentPath === `/docs/${doc.slug}/`,
        })),
      };
    })
    .filter(cat => cat.children && cat.children.length > 0);

  return navigation;
}

export async function getDocsByCategory(category: DocCategory) {
  const docs = await getCollection(
    "docs",
    ({ data }) => data.category === category && !data.draft
  );
  return docs.sort((a, b) => a.data.order - b.data.order);
}

export async function getAllDocs() {
  const docs = await getCollection("docs", ({ data }) => !data.draft);
  return docs.sort((a, b) => {
    // Sort by category order first, then by doc order
    const catOrderA = CATEGORY_META[a.data.category]?.order || 999;
    const catOrderB = CATEGORY_META[b.data.category]?.order || 999;
    if (catOrderA !== catOrderB) return catOrderA - catOrderB;
    return a.data.order - b.data.order;
  });
}

export async function getAdjacentDocs(currentSlug: string) {
  const allDocs = await getAllDocs();
  const currentIndex = allDocs.findIndex(doc => doc.slug === currentSlug);

  return {
    prev: currentIndex > 0 ? allDocs[currentIndex - 1] : null,
    next: currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null,
  };
}
