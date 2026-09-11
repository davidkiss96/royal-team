import { sanityClient } from "../client";

/**
 * `PriceCategory` query module (docs/content-model.md Section 10), following
 * the `Service` pattern (`services.ts`): a queried document type (not a
 * singleton), with `isActive`/`displayOrder` filtering and ordering done in
 * GROQ rather than in JavaScript. Five-minute revalidation matches the same
 * low-volatility, editor-curated content-type default used for `Service`.
 */
const REVALIDATE_SECONDS = 300;

interface RawPriceItem {
  name: string;
  note: string | null;
  priceType: "fixed" | "from" | "quote";
  amount: number | null;
}

interface RawPriceCategory {
  title: string;
  items: RawPriceItem[];
}

/**
 * The `/arlista` shape — mirrors the fields `PriceCategorySection` actually
 * reads. No `displayOrder` or `isActive`: ordering and filtering are fully
 * resolved in GROQ, so nothing downstream needs to re-derive them.
 */
export interface PriceItem {
  name: string;
  note?: string;
  priceType: "fixed" | "from" | "quote";
  amount?: number;
}

export interface PriceCategory {
  title: string;
  items: PriceItem[];
}

/**
 * Inactive categories and inactive items are both excluded here, not
 * client-side (task requirement): `items[isActive == true]` drops inactive
 * items, and `count(items[isActive == true]) > 0` then drops any category
 * left with zero active items rather than rendering an empty section.
 * Item order within a category is preserved as authored (no item-level
 * `displayOrder` — not part of the finalized content model).
 */
const PRICE_CATEGORIES_QUERY = `*[
  _type == "priceCategory" &&
  isActive == true &&
  count(items[isActive == true]) > 0
] | order(displayOrder asc) {
  title,
  "items": items[isActive == true] {
    name,
    note,
    priceType,
    amount
  }
}`;

function toPriceCategory(raw: RawPriceCategory): PriceCategory {
  return {
    title: raw.title,
    items: raw.items.map((item) => ({
      name: item.name,
      note: item.note ?? undefined,
      priceType: item.priceType,
      amount: item.amount ?? undefined,
    })),
  };
}

/**
 * Fetches all active price categories (with only their active items) for
 * `/arlista`, ordered and filtered in GROQ
 * (docs/development-guidelines.md Section 8).
 */
export async function getPriceCategories(): Promise<PriceCategory[]> {
  const categories = await sanityClient.fetch<RawPriceCategory[]>(
    PRICE_CATEGORIES_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } },
  );

  return categories.map(toPriceCategory);
}
