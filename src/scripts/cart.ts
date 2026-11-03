import { BRAND_BY_ID, money } from "../data/catalog";
import { icon } from "../data/icons";
import { $, cart, esc, store, toast, user } from "./store";

const root = $("#root")!;

function render() {
  const lines = cart.lines();
  if (!lines.length) {
    // Mirrors the reference: signed-out visitors are nudged to sign in; signed-in visitors get a plain empty state.
    root.innerHTML = user.get()
      ? `<div class="empty"><svg class="empty__art" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 40h26l16 78h92l14-58H56"/><path d="M62 78h98M68 98h88M80 60l6 58M110 60l2 58M140 60l-4 58"/><circle cx="80" cy="148" r="10"/><circle cx="146" cy="148" r="10"/></svg><h2>Your cart is empty</h2><p>Find something you love and it'll show up here.</p><a class="btn-primary" href="/">Keep browsing</a></div>`
      : `<div class="empty"><svg class="empty__art" viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 40h26l16 78h92l14-58H56"/><path d="M62 78h98M68 98h88M80 60l6 58M110 60l2 58M140 60l-4 58"/><circle cx="80" cy="148" r="10"/><circle cx="146" cy="148" r="10"/></svg><h2>Your cart is waiting</h2><p>Sign in to add products to your cart</p><a class="btn-primary" href="/login?next=/cart">Sign in</a></div>`;
    return;
  }
  const t = cart.totals();
  const entered = store.get<string | null>("promo", null);
  const promoMsg = entered && !t.promo ? "Code not valid" : t.promo ? `${t.promo} applied` : "";
  root.innerHTML = `
    <h1 class="page__title">Cart <span class="muted">(${cart.count()})</span></h1>
    <div class="cart">
      <ul class="lines">${lines.map((l) => {
        const k = cart.key(l), b = BRAND_BY_ID[l.p.brand];
        return `<li class="line">
          <a href="/product/${l.p.id}" class="line__img thumb ${l.p.ph}" aria-label="${esc(l.p.name)}"></a>
          <div class="line__body">
            <a href="/product/${l.p.id}" class="line__name">${esc(l.p.name)}</a>
            <span class="muted">${esc(b.name)}${l.opt ? " · " + esc(l.opt) : ""}</span>
            <div class="qty qty--sm">
              <button aria-label="Decrease quantity" data-qty="${esc(k)}" data-d="-1">${icon("minus")}</button><output>${l.qty}</output>
              <button aria-label="Increase quantity" data-qty="${esc(k)}" data-d="1">${icon("plus")}</button>
            </div>
          </div>
          <div class="line__side"><strong>${money(l.p.price * l.qty)}</strong><button class="link" data-rm="${esc(k)}">Remove</button></div>
        </li>`;
      }).join("")}</ul>
      <aside class="summary">
        <h2>Order summary</h2>
        <form class="promo" id="promo"><input name="code" placeholder="Promo code (try SHOP10)" aria-label="Promo code" value="${esc(entered ?? "")}"><button class="btn" type="submit">Apply</button></form>
        ${promoMsg ? `<p class="muted" role="status">${promoMsg}</p>` : ""}
        <dl>
          <div><dt>Subtotal</dt><dd>${money(t.subtotal)}</dd></div>
          ${t.discount ? `<div><dt>Discount</dt><dd>−${money(t.discount)}</dd></div>` : ""}
          <div><dt>Shipping</dt><dd>${t.shipping ? money(t.shipping) : "Free"}</dd></div>
          <div><dt>Estimated tax</dt><dd>${money(t.tax)}</dd></div>
          <div class="total"><dt>Total</dt><dd>${money(t.total)}</dd></div>
        </dl>
        ${t.shipping ? `<p class="muted">Add ${money(7500 - (t.subtotal - t.discount))} more for free shipping.</p>` : ""}
        <a class="btn-primary btn-block" href="/checkout">Checkout</a>
      </aside>
    </div>`;
}

root.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  const q = t.closest<HTMLElement>("[data-qty]");
  if (q) { const cur = cart.items().find((i) => cart.key(i) === q.dataset.qty); if (cur) cart.setQty(q.dataset.qty!, cur.qty + +q.dataset.d!); }
  const rm = t.closest<HTMLElement>("[data-rm]");
  if (rm) { cart.remove(rm.dataset.rm!); toast("Removed from cart"); }
});
root.addEventListener("submit", (e) => {
  const f = (e.target as HTMLElement).closest<HTMLFormElement>("#promo");
  if (!f) return;
  e.preventDefault();
  store.set("promo", String(new FormData(f).get("code")).trim().toUpperCase() || null);
});

render();
document.addEventListener("shop:change", render);
