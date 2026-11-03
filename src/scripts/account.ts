import { $, esc, favs, follows, store, toast, user, validEmail, type Address, type Order, type User } from "./store";

const root = $("#root")!;

function render() {
  const u = user.get();
  if (!u) { location.replace("/login?next=/account"); return; }

  const a = store.get<Address>("address", {}), orders = store.get<Order[]>("orders", []);
  root.innerHTML = `
    <h1 class="page__title">Hi, ${esc(u.name.split(" ")[0])}</h1>
    <div class="stats">
      <a href="/orders"><strong>${orders.length}</strong> Orders</a>
      <a href="/favorites"><strong>${favs.list().length}</strong> Favorites</a>
      <a href="/favorites"><strong>${follows.list().length}</strong> Brands followed</a>
    </div>
    <form id="profile" class="form-card" novalidate>
      <h2>Profile</h2>
      <div class="fields fields--2">
        <label class="field"><span>Name</span><input name="name" value="${esc(u.name)}" required></label>
        <label class="field"><span>Email</span><input name="email" type="email" value="${esc(u.email)}" required></label>
        <label class="field"><span>Street</span><input name="street" value="${esc(a.street || "")}"></label>
        <label class="field"><span>City</span><input name="city" value="${esc(a.city || "")}"></label>
        <label class="field"><span>Postal code</span><input name="zip" value="${esc(a.zip || "")}"></label>
      </div>
      <p class="error" id="err" role="alert" hidden></p>
      <button class="btn-primary" type="submit">Save changes</button>
    </form>
    <div class="actions">
      <button class="btn" id="out">Sign out</button>
      <button class="btn" id="wipe">Clear all local data</button>
    </div>`;

  $<HTMLFormElement>("#profile")!.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as Record<string, string>;
    if (!fd.name.trim() || !validEmail(fd.email)) { const err = $("#err")!; err.hidden = false; err.textContent = "Enter your name and a valid email."; return; }
    store.set("address", { name: fd.name.trim(), street: fd.street, city: fd.city, zip: fd.zip });
    const next = { name: fd.name.trim(), email: fd.email.trim() };
    store.set("profiles", { ...store.get<Record<string, User>>("profiles", {}), [next.email.toLowerCase()]: next });
    user.set(next);
    toast("Profile saved");
  });
  $("#out")!.addEventListener("click", () => user.set(null));
  $("#wipe")!.addEventListener("click", () => {
    if (confirm("Remove your profile, cart, favorites and orders from this browser?")) { store.wipe(); location.reload(); }
  });
}

render();
document.addEventListener("shop:change", render);
