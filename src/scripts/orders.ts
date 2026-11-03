import { PRODUCT_BY_ID, money } from "../data/catalog";
import { icon } from "../data/icons";
import { $, cart, esc, qs, store, user, type Order } from "./store";

const STEPS = ["Processing", "Shipped", "Delivered"];
// demo: status is simulated from the order's age
const statusOf = (o: Order) => { const age = (Date.now() - o.date) / 86400000; return age < 1 ? 0 : age < 3 ? 1 : 2; };

const root = $("#root")!;
const fresh = qs("new");

// Local copies first, then merge in whatever the server (SQLite) has for the same emails.
async function load(): Promise<Order[]> {
  const local = store.get<Order[]>("orders", []);
  const emails = new Set([...local.map((o) => o.email), user.get()?.email].filter(Boolean).map((e) => e!.toLowerCase()));
  const byId = new Map(local.map((o) => [o.id, o]));
  await Promise.all([...emails].map(async (email) => {
    try {
      const res = await fetch("/api/orders?email=" + encodeURIComponent(email));
      if (res.ok) for (const o of ((await res.json()).orders ?? []) as Order[]) byId.set(o.id, o);
    } catch { /* offline or no server: local copies only */ }
  }));
  return [...byId.values()].sort((a, b) => b.date - a.date);
}

const orders = await load();

root.innerHTML = `
  <h1 class="page__title">Orders</h1>
  ${fresh && orders.some((o) => o.id === fresh) ? `<div class="notice" role="status">${icon("check")} Order <strong>${esc(fresh)}</strong> placed. A confirmation would be emailed in a real store.</div>` : ""}
  ${orders.length ? orders.map((o) => {
    const s = statusOf(o);
    return `<details class="order" ${o.id === fresh ? "open" : ""}>
      <summary>
        <span><strong>${esc(o.id)}</strong><small class="muted">${new Date(o.date).toLocaleDateString("en-US", { dateStyle: "medium" })}</small></span>
        <span class="status status--${s}">${STEPS[s]}</span>
        <strong>${money(o.totals.total)}</strong>
      </summary>
      <ol class="track">${STEPS.map((st, i) => `<li class="${i <= s ? "done" : ""}">${st}</li>`).join("")}</ol>
      <ul class="mini">${o.items.map((i) => {
        const p = PRODUCT_BY_ID[i.id];
        return p ? `<li><span class="thumb ${p.ph}"></span><a href="/product/${p.id}">${esc(p.name)}<br><small class="muted">Qty ${i.qty}${i.opt ? " · " + esc(i.opt) : ""}</small></a><strong>${money(i.price * i.qty)}</strong></li>` : "";
      }).join("")}</ul>
      <p class="muted">Ships to ${esc(o.address.name ?? "")}, ${esc(o.address.street ?? "")}, ${esc(o.address.city ?? "")} ${esc(o.address.zip ?? "")}</p>
      <button class="btn" data-reorder="${esc(o.id)}">Buy again</button>
    </details>`;
  }).join("") : `<div class="empty"><h2>No orders yet</h2><p>When you place an order, you'll be able to track it here.</p><a class="btn-primary" href="/">Keep browsing</a></div>`}`;

root.addEventListener("click", (e) => {
  const r = (e.target as HTMLElement).closest<HTMLElement>("[data-reorder]");
  if (!r) return;
  orders.find((o) => o.id === r.dataset.reorder)?.items.forEach((i) => cart.add(i.id, i.opt, i.qty));
  location.href = "/cart";
});
