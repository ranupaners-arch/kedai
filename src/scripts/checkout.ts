import { money } from "../data/catalog";
import { $, cart, esc, store, user, validEmail, type Address, type Order } from "./store";

const root = $("#root")!;
const lines = cart.lines();

if (!lines.length) {
  root.innerHTML = `<div class="empty"><h2>Nothing to check out</h2><p>Your cart is empty.</p><a class="btn-primary" href="/">Keep browsing</a></div>`;
} else {
  const t = cart.totals(), u = user.get(), a = store.get<Address>("address", {});
  const field = (name: string, label: string, val = "", attrs = "") =>
    `<label class="field"><span>${label}</span><input name="${name}" value="${esc(val)}" required ${attrs}></label>`;

  root.innerHTML = `
    <nav class="crumbs"><a href="/cart">Cart</a> › <span>Checkout</span></nav>
    <h1 class="page__title">Checkout</h1>
    <div class="cart">
      <form id="co" class="form-card" novalidate>
        <h2>Contact</h2>
        <div class="fields">${field("email", "Email", u?.email, 'type="email" autocomplete="email"')}</div>
        <h2>Shipping address</h2>
        <div class="fields fields--2">
          ${field("name", "Full name", u?.name || a.name, 'autocomplete="name"')}
          ${field("street", "Street address", a.street, 'autocomplete="street-address"')}
          ${field("city", "City", a.city, 'autocomplete="address-level2"')}
          ${field("zip", "Postal code", a.zip, 'autocomplete="postal-code"')}
        </div>
        <h2>Payment</h2>
        <p class="note">This is a demo store. No card details are collected and no payment is taken.</p>
        <label class="radio"><input type="radio" name="pay" value="demo" checked> Demo payment</label>
        <p class="error" id="err" role="alert" hidden></p>
        <button class="btn-primary btn-block" type="submit">Place order · ${money(t.total)}</button>
      </form>
      <aside class="summary">
        <h2>In your order</h2>
        <ul class="mini">${lines.map((l) => `<li><span class="thumb ${l.p.ph}"></span><span>${esc(l.p.name)}<br><small class="muted">Qty ${l.qty}${l.opt ? " · " + esc(l.opt) : ""}</small></span><strong>${money(l.p.price * l.qty)}</strong></li>`).join("")}</ul>
        <dl>
          <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
          ${t.discount ? `<div><dt>Discount</dt><dd>−${money(t.discount)}</dd></div>` : ""}
          <div><dt>Shipping</dt><dd>${t.shipping ? money(t.shipping) : "Free"}</dd></div>
          <div><dt>Tax</dt><dd>${money(t.tax)}</dd></div>
          <div class="total"><dt>Total</dt><dd>${money(t.total)}</dd></div>
        </dl>
      </aside>
    </div>`;

  $<HTMLFormElement>("#co")!.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Record<string, string>;
    const err = $("#err")!, btn = $<HTMLButtonElement>("#co button[type=submit]")!;
    const missing = ["email", "name", "street", "city", "zip"].some((k) => !String(fd[k] || "").trim());
    if (missing || !validEmail(fd.email)) {
      err.hidden = false; err.textContent = missing ? "Please fill in all fields." : "Enter a valid email address.";
      return;
    }
    err.hidden = true; btn.disabled = true;

    // Prefer the server (SQLite) — it recomputes prices and totals itself. Fall back to a local-only order if it's unreachable.
    let order: Order | undefined;
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...fd, promo: store.get<string | null>("promo", null), items: lines.map((l) => ({ id: l.id, opt: l.opt, qty: l.qty })) }),
      });
      const data = await res.json();
      if (!res.ok) { err.hidden = false; err.textContent = data.error ?? "Could not place the order."; btn.disabled = false; return; }
      order = data.order as Order;
    } catch {
      order = {
        id: "SHP-" + Date.now().toString(36).toUpperCase(), date: Date.now(), email: fd.email,
        address: { name: fd.name, street: fd.street, city: fd.city, zip: fd.zip },
        items: lines.map((l) => ({ id: l.id, opt: l.opt, qty: l.qty, price: l.p.price })), totals: t,
      };
    }
    store.set("address", order.address);
    store.set("orders", [order, ...store.get<Order[]>("orders", [])]);
    store.set("promo", null);
    cart.clear();
    location.href = "/orders?new=" + order.id;
  });
}
