/** Client-side state (demo — everything lives in localStorage; no backend). */
import { PRODUCT_BY_ID, type Product } from "../data/catalog";

export const esc = (s: unknown) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
export const qs = (k: string) => new URLSearchParams(location.search).get(k);

export const store = {
  get<T>(k: string, d: T): T {
    try { const v = localStorage.getItem("shop:" + k); return v === null ? d : (JSON.parse(v) as T); } catch { return d; }
  },
  set(k: string, v: unknown) {
    try { localStorage.setItem("shop:" + k, JSON.stringify(v)); } catch {}
    document.dispatchEvent(new Event("shop:change"));
  },
  wipe() {
    try { Object.keys(localStorage).filter((k) => k.startsWith("shop:")).forEach((k) => localStorage.removeItem(k)); } catch {}
  },
};

export interface CartItem { id: string; opt?: string; qty: number }
export interface CartLine extends CartItem { p: Product }

export const cart = {
  items: () => store.get<CartItem[]>("cart", []),
  key: (i: CartItem) => i.id + "|" + (i.opt || ""),
  add(id: string, opt?: string, qty = 1) {
    const items = cart.items(); const k = id + "|" + (opt || "");
    const hit = items.find((i) => cart.key(i) === k);
    if (hit) hit.qty = Math.min(99, hit.qty + qty); else items.push({ id, opt, qty });
    store.set("cart", items);
  },
  setQty(k: string, qty: number) {
    store.set("cart", cart.items().map((i) => (cart.key(i) === k ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)));
  },
  remove(k: string) { store.set("cart", cart.items().filter((i) => cart.key(i) !== k)); },
  clear() { store.set("cart", []); },
  count: () => cart.items().reduce((n, i) => n + i.qty, 0),
  lines: (): CartLine[] => cart.items().map((i) => ({ ...i, p: PRODUCT_BY_ID[i.id] })).filter((l) => l.p),
  totals() {
    const lines = cart.lines();
    const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
    const promo = store.get<string | null>("promo", null);
    const discount = promo === "SHOP10" ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal === 0 || subtotal - discount >= 7500 ? 0 : 600;
    const tax = Math.round((subtotal - discount) * 0.08);
    return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax, promo: discount ? promo : null };
  },
};
export type Totals = ReturnType<typeof cart.totals>;

const idList = (key: string) => ({
  list: () => store.get<string[]>(key, []),
  has: (id: string) => store.get<string[]>(key, []).includes(id),
  toggle(id: string) {
    const l = store.get<string[]>(key, []);
    store.set(key, l.includes(id) ? l.filter((x) => x !== id) : [...l, id]);
    return !l.includes(id);
  },
});
export const favs = idList("favs");
export const follows = idList("follows");

export interface User { name: string; email: string }
export const user = { get: () => store.get<User | null>("user", null), set: (u: User | null) => store.set("user", u) };

export interface Address { name?: string; street?: string; city?: string; zip?: string }
export interface Order {
  id: string; date: number; email: string; address: Address;
  items: { id: string; opt?: string; qty: number; price: number }[]; totals: Totals;
}

let timer: number | undefined;
export function toast(msg: string) {
  const t = $("#toast"); if (!t) return;
  t.textContent = msg; t.classList.add("on");
  clearTimeout(timer); timer = window.setTimeout(() => t.classList.remove("on"), 2200);
}
export const validEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s);
