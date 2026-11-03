/** Two-step demo sign-in: email → (new email only) name. Profiles live in localStorage. */
import { $, qs, store, user, validEmail, type User } from "./store";

// Only allow same-site relative redirects.
const raw = qs("next") ?? "/account";
const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/account";

if (user.get()) location.replace(next);

const form = $<HTMLFormElement>("#loginForm")!;
const email = form.elements.namedItem("email") as HTMLInputElement;
const name = form.elements.namedItem("name") as HTMLInputElement;
let step: "email" | "name" = "email";

const profiles = () => store.get<Record<string, User>>("profiles", {});
const err = (msg: string) => { const e = $("#err")!; e.hidden = !msg; e.textContent = msg; };

function show(s: typeof step) {
  step = s; err("");
  const second = s === "name";
  $("#title")!.textContent = second ? "Create your account" : "Sign in to Kedai";
  $("#sub")!.textContent = second ? `No account yet for ${email.value.trim()}` : "Or create an account";
  $("#emailField")!.hidden = second;
  $("#nameField")!.hidden = !second;
  $("#back")!.hidden = !second;
  $("#cta")!.textContent = second ? "Create account" : "Continue";
  (second ? name : email).focus();
}

function finish(u: User) {
  store.set("profiles", { ...profiles(), [u.email.toLowerCase()]: u });
  user.set(u);
  location.href = next;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (step === "email") {
    const v = email.value.trim();
    if (!validEmail(v)) return err("Enter a valid email address.");
    const known = profiles()[v.toLowerCase()];
    return known ? finish(known) : show("name");
  }
  const n = name.value.trim();
  if (!n) return err("Tell us what to call you.");
  finish({ name: n, email: email.value.trim() });
});
$("#back")!.addEventListener("click", () => show("email"));
email.focus();
