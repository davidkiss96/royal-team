/**
 * Mock data shaped to match the approved `PriceCategory` document
 * (docs/content-model.md Section 10), including the `quote` priceType
 * value — an approved addition once Next.js implementation of the Price
 * List page surfaced a real gap (Section 0 item 10): the reference's
 * "Ingyenes" line items aren't really 0 Ft services, they're quote-only
 * items with no numeric amount at all.
 *
 * All amounts and category/item copy are taken directly from the approved
 * Figma reference's `PRICING_CATEGORIES` array — only the *shape* changed
 * (a pre-formatted price string split into `priceType` + `amount`, per the
 * content model's explicit "no formatted price string field" decision).
 */
export interface PriceItem {
  name: string;
  note?: string;
  priceType: "fixed" | "from" | "quote";
  amount?: number;
  isActive: boolean;
}

export interface PriceCategory {
  title: string;
  displayOrder: number;
  isActive: boolean;
  items: PriceItem[];
}

export const ALL_PRICE_CATEGORIES: PriceCategory[] = [
  {
    title: "DPF & Részecskeszűrő",
    displayOrder: 1,
    isActive: true,
    items: [
      {
        name: "DPF szűrő diagnosztika",
        note: "Hibaolvasás + nyomásmérés",
        priceType: "from",
        amount: 8900,
        isActive: true,
      },
      {
        name: "DPF szűrő ultrahangos tisztítás",
        note: "Személyautó, szűrőmérettől függően",
        priceType: "from",
        amount: 69900,
        isActive: true,
      },
      {
        name: "FAP szűrő tisztítás",
        priceType: "from",
        amount: 69900,
        isActive: true,
      },
      {
        name: "DPF szűrő csere (alkatrész nélkül)",
        priceType: "from",
        amount: 24900,
        isActive: true,
      },
    ],
  },
  {
    title: "Elektronikai Diagnosztika",
    displayOrder: 2,
    isActive: true,
    items: [
      {
        name: "Alapdiagnosztika (hibaolvasás)",
        priceType: "from",
        amount: 5900,
        isActive: true,
      },
      {
        name: "Teljes körű multirendszer diagnosztika",
        note: "Összes elektronikus rendszer",
        priceType: "from",
        amount: 12900,
        isActive: true,
      },
      {
        name: "Komplex hibaelemzés",
        priceType: "from",
        amount: 18900,
        isActive: true,
      },
    ],
  },
  {
    title: "Futómű & Kerékbeállítás",
    displayOrder: 3,
    isActive: true,
    items: [
      {
        name: "3D kerékbeállítás (2 tengely)",
        priceType: "from",
        amount: 14900,
        isActive: true,
      },
      {
        name: "Futómű geometria ellenőrzés",
        priceType: "from",
        amount: 8900,
        isActive: true,
      },
      {
        name: "Futómű szerviz árajánlat",
        priceType: "quote",
        isActive: true,
      },
    ],
  },
  {
    title: "Fékrendszer",
    displayOrder: 4,
    isActive: true,
    items: [
      {
        name: "Fékbetét csere (1 tengely, alkatrész nélkül)",
        priceType: "from",
        amount: 9900,
        isActive: true,
      },
      {
        name: "Féktárcsa + betét csere (1 tengely, alkatrész nélkül)",
        priceType: "from",
        amount: 14900,
        isActive: true,
      },
      {
        name: "Fékfolyadék csere",
        priceType: "from",
        amount: 7900,
        isActive: true,
      },
    ],
  },
  {
    title: "Olajcsere & Karbantartás",
    displayOrder: 5,
    isActive: true,
    items: [
      {
        name: "Motorolaj csere (olaj nélkül)",
        priceType: "from",
        amount: 8900,
        isActive: true,
      },
      {
        name: "Teljes szervizcsomag (alkatrész nélkül)",
        note: "Motorolaj, légszűrő, pollenszűrő",
        priceType: "from",
        amount: 18900,
        isActive: true,
      },
      {
        name: "Légszűrő csere",
        priceType: "from",
        amount: 4900,
        isActive: true,
      },
      {
        name: "Hűtőfolyadék csere",
        priceType: "from",
        amount: 12900,
        isActive: true,
      },
    ],
  },
  {
    title: "Teljesítmény & Egyedi munkák",
    displayOrder: 6,
    isActive: true,
    items: [
      {
        name: "Teljesítmény diagnosztika",
        note: "Komplex motor- és turbórendszer vizsgálat",
        priceType: "from",
        amount: 14900,
        isActive: true,
      },
      {
        name: "Egyedi árajánlatkérés",
        priceType: "quote",
        isActive: true,
      },
    ],
  },
];
