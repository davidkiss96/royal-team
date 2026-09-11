// Non-breaking spaces (both between digit groups and before "Ft") prevent
// an amount from wrapping awkwardly across a line break — visually
// identical to a plain space otherwise.
const NBSP = " ";

function groupThousands(amount: number): string {
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Composes the displayed price string from `priceType` + `amount`, per the
 * approved decision that editors never hand-type formatted price text
 * (docs/content-model.md Section 10). A `quote` item — or a `fixed`/`from`
 * item missing its amount, which the Studio schema shouldn't allow but this
 * still guards against — is never rendered as "Ingyenes" (free): both are
 * "ask us for a price," not "this costs nothing," and conflating the two
 * would misrepresent a paid service. */
export function formatPriceDisplay(item: {
  priceType: "fixed" | "from" | "quote";
  amount?: number;
}): string {
  if (item.priceType === "quote" || item.amount === undefined) {
    return "Egyedi ajánlat";
  }
  const formatted = `${groupThousands(item.amount)}${NBSP}Ft`;
  return item.priceType === "from" ? `${formatted}-tól` : formatted;
}
