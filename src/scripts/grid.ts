/** Filtering + sorting for server-rendered product cards on category pages. */
import { $, $$, qs } from "./store";

export function initGrid({ typeFromUrl = false } = {}) {
  const cards = $$("[data-card]");
  const state = { type: typeFromUrl ? qs("t") ?? "" : "", brand: "", sort: "featured", sale: false, price: "" };
  const chips = $$("[data-type]").filter((c) => c.tagName === "BUTTON");
  const none = $("#none"), count = $("#count");

  const sorters: Record<string, (a: HTMLElement, b: HTMLElement) => number> = {
    featured: () => 0,
    "price-asc": (a, b) => +a.dataset.price! - +b.dataset.price!,
    "price-desc": (a, b) => +b.dataset.price! - +a.dataset.price!,
    rating: (a, b) => +b.dataset.rating! - +a.dataset.rating!,
  };

  const apply = () => {
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.type === state.type)));
    const shown = cards.filter((c) => {
      const price = +c.dataset.price! / 100;
      const [lo, hi] = state.price ? state.price.split("-").map(Number) : [0, Infinity];
      const ok = (!state.type || c.dataset.type === state.type) && (!state.brand || c.dataset.brand === state.brand)
        && (!state.sale || +c.dataset.off! > 0) && price >= lo && price < hi;
      c.hidden = !ok;
      return ok;
    });
    [...shown].sort(sorters[state.sort]).forEach((c, i) => (c.style.order = String(i)));
    if (count) count.textContent = `${shown.length} product${shown.length === 1 ? "" : "s"}`;
    if (none) none.hidden = shown.length > 0;
  };

  chips.forEach((c) => c.addEventListener("click", () => { state.type = c.dataset.type!; apply(); }));
  $<HTMLSelectElement>("#brandSel")?.addEventListener("change", (e) => { state.brand = (e.target as HTMLSelectElement).value; apply(); });
  $<HTMLSelectElement>("#sortSel")?.addEventListener("change", (e) => { state.sort = (e.target as HTMLSelectElement).value; apply(); });
  const sale = $("#saleBtn");
  sale?.addEventListener("click", () => { state.sale = !state.sale; sale.setAttribute("aria-pressed", String(state.sale)); apply(); });
  $<HTMLSelectElement>("#priceSel")?.addEventListener("change", (e) => { state.price = (e.target as HTMLSelectElement).value; apply(); });
  apply();
}
