/** Runs on every page: badges, favorites, carousel arrows, cookie banner, search prefill. */
import { $, $$, cart, favs, store, toast, user, qs, esc } from "./store";

function badge(n: number) { return n > 0 ? `<span class="rail__badge">${n > 99 ? "99+" : n}</span>` : ""; }

function sync() {
  $$("[data-fav]").forEach((b) => b.setAttribute("aria-pressed", String(favs.has(b.dataset.fav!))));
  for (const [href, n] of [["/cart", cart.count()], ["/favorites", favs.list().length]] as const) {
    const a = $(`.rail__item[href="${href}"]`); if (!a) continue;
    $(".rail__badge", a)?.remove(); a.insertAdjacentHTML("beforeend", badge(n));
  }
  const av = $("#avatar"), u = user.get();
  if (av) {
    av.classList.toggle("has-user", !!u);
    (av as HTMLAnchorElement).href = u ? "/account" : "/login";
    $("#avatarIcon")!.innerHTML = u ? esc(u.name[0].toUpperCase()) : av.dataset.icon!;
    $("#avatarLabel")!.textContent = u ? u.name.split(" ")[0] : "Sign in";
  }
}

sync();
document.addEventListener("shop:change", sync);
window.addEventListener("storage", sync);

const dl = $("#dl");
if (dl && !store.get("dl-dismissed", false)) dl.hidden = false;
$("#dlClose")?.addEventListener("click", () => { dl!.hidden = true; store.set("dl-dismissed", true); });

const cookie = $("#cookie");
if (cookie && !store.get("cookie", null)) cookie.hidden = false;

const q = qs("q"), input = $<HTMLInputElement>('form[data-search] input[name="q"]');
if (q && input && location.pathname.startsWith("/search")) input.value = q;

document.addEventListener("click", (e) => {
  const t = e.target as HTMLElement;
  const fav = t.closest<HTMLElement>("[data-fav]");
  if (fav) { e.preventDefault(); toast(favs.toggle(fav.dataset.fav!) ? "Saved to favorites" : "Removed from favorites"); return; }
  const sc = t.closest("[data-scroll]");
  if (sc) { const r = sc.parentElement!.querySelector(".row")!; r.scrollBy({ left: r.clientWidth * 0.8, behavior: "smooth" }); return; }
  const ck = t.closest<HTMLElement>("[data-cookie]");
  if (ck) { store.set("cookie", ck.dataset.cookie); cookie!.hidden = true; return; }
  const add = t.closest<HTMLElement>("[data-add]");
  if (add) { cart.add(add.dataset.add!, add.dataset.opt, 1); toast("Added to cart"); }
});

/* Home page: the main menu starts docked at the bottom and glides to the left edge once the page is scrolled
   (and back again at the top). Pure state flip here; the movement itself is a CSS transition. */
const dock = $(".rail-group[data-dock]");
if (dock) {
  const AWAY = 40, HOME = 10;                       // hysteresis so it doesn't flicker around the threshold
  const set = (v: "bottom" | "left") => { if (dock.dataset.dock !== v) dock.dataset.dock = v; };
  const update = () => { const y = window.scrollY; if (y > AWAY) set("left"); else if (y < HOME) set("bottom"); };
  update();                                          // reloads mid-page start in the right place, without animating
  requestAnimationFrame(() => requestAnimationFrame(() => dock.setAttribute("data-ready", "")));
  let ticking = false;
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });
  window.addEventListener("load", update);
}
