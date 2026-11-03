/**
 * Catalog data — original, generated deterministically (no real brands or products).
 * Replace with a CMS / API later. Set `image` on a product or brand to use a real photo
 * (put files in /public/images and use a path like "/images/linen-dress.jpg").
 */
export type CategoryKey = "women" | "men" | "beauty" | "home" | "baby" | "tech" | "food";

export interface Category {
  label: string;
  color: string;
  icon: string;
  types: [plural: string, singular: string][];
  options: string[];
}

export interface Brand {
  id: string;
  name: string;
  cat: CategoryKey;
  ph: string;
  tagline: string;
  rating: string;
  reviews: number;
  image?: string;
}

export interface Product {
  id: string;
  brand: string;
  cat: CategoryKey;
  type: string;
  name: string;
  price: number; // cents
  rating: number;
  reviews: number;
  ph: string;
  alt: string[];
  desc: string;
  isNew: boolean;
  /** Original price in cents, when the product is on sale. Display only — the charged price is always `price`. */
  compareAt?: number;
  image?: string;
}

export const CATEGORIES: Record<CategoryKey, Category> = {
  women: { label: "Women", color: "#e0457b", icon: "women", types: [["Dresses", "Dress"], ["Knitwear", "Sweater"], ["Shoes", "Leather Flats"], ["Bags", "Shoulder Bag"]], options: ["XS", "S", "M", "L", "XL"] },
  men: { label: "Men", color: "#2f6fed", icon: "men", types: [["Jackets", "Jacket"], ["Denim", "Jeans"], ["Sneakers", "Sneakers"], ["Watches", "Watch"]], options: ["S", "M", "L", "XL"] },
  beauty: { label: "Beauty", color: "#f08a24", icon: "beauty", types: [["Skincare", "Serum"], ["Fragrance", "Eau de Parfum"], ["Makeup", "Lip Tint"], ["Hair", "Hair Oil"]], options: ["30 ml", "50 ml", "100 ml"] },
  home: { label: "Home", color: "#2e9e6b", icon: "home", types: [["Decor", "Ceramic Vase"], ["Bedding", "Duvet Cover"], ["Kitchen", "Cookware Set"], ["Lighting", "Table Lamp"]], options: ["Small", "Medium", "Large"] },
  baby: { label: "Baby & Toddler", color: "#e0a21b", icon: "baby", types: [["Clothing", "Romper"], ["Toys", "Wooden Toy"], ["Nursery", "Swaddle"], ["Feeding", "Bottle Set"]], options: ["0–3 m", "3–6 m", "6–12 m", "12–18 m"] },
  tech: { label: "Tech", color: "#7a4be0", icon: "tech", types: [["Audio", "Headphones"], ["Wearables", "Smart Band"], ["Accessories", "Charging Dock"], ["Cameras", "Instant Camera"]], options: ["Black", "Silver", "Sand"] },
  food: { label: "Food & Drink", color: "#c4482f", icon: "food", types: [["Coffee", "Coffee Beans"], ["Tea", "Loose Leaf Tea"], ["Snacks", "Snack Box"], ["Pantry", "Olive Oil"]], options: ["250 g", "500 g", "1 kg"] },
};
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

const BRAND_SEED: [string, string, CategoryKey, string, string][] = [
  ["terra-co", "Terra & Co.", "women", "ph-terra", "Warm, earthy pieces cut for everyday."],
  ["maren", "Maren", "women", "ph-ivory", "Soft tailoring in natural fibres."],
  ["willow-lane", "Willow Lane", "women", "ph-sage", "Easy dresses for long afternoons."],
  ["northfield", "Northfield", "men", "ph-slate", "Outerwear built for weather."],
  ["harbor-row", "Harbor Row", "men", "ph-olive", "Coastal basics, made to last."],
  ["ridgeway", "Ridgeway", "men", "ph-ash", "Trail-ready staples."],
  ["petal-lab", "Petal Lab", "beauty", "ph-rose", "Gentle skincare from botanical actives."],
  ["aurelia", "Aurelia", "beauty", "ph-sand", "Small-batch fragrance."],
  ["dew-theory", "Dew Theory", "beauty", "ph-sage", "Glow-first makeup and hair care."],
  ["oat-home", "Oat Home", "home", "ph-ivory", "Calm, neutral homewares."],
  ["kiln-co", "Kiln & Co.", "home", "ph-terra", "Hand-thrown ceramics and cookware."],
  ["lumen", "Lumen", "home", "ph-slate", "Lighting with a quiet glow."],
  ["little-fern", "Little Fern", "baby", "ph-sage", "Organic cotton for tiny humans."],
  ["nimbus-kids", "Nimbus Kids", "baby", "ph-sand", "Toys that grow with them."],
  ["pebble-pine", "Pebble & Pine", "baby", "ph-clay", "Nursery essentials, thoughtfully made."],
  ["orbit-audio", "Orbit Audio", "tech", "ph-black", "Sound, simplified."],
  ["nova-gear", "Nova Gear", "tech", "ph-ash", "Everyday wearables and chargers."],
  ["pixel-hearth", "Pixel Hearth", "tech", "ph-clay", "Analog-feeling cameras."],
  ["roast-society", "Roast Society", "food", "ph-clay", "Single-origin coffee, roasted weekly."],
  ["steep", "Steep", "food", "ph-olive", "Loose-leaf tea from small farms."],
  ["pantry-club", "Pantry Club", "food", "ph-tan", "Snacks and staples worth stocking."],
];

const PHS = ["ph-tan", "ph-terra", "ph-sage", "ph-ivory", "ph-clay", "ph-sand", "ph-rose", "ph-olive", "ph-fog", "ph-slate"];
const ADJ = ["Linen", "Everyday", "Classic", "Heritage", "Softline", "Studio", "Field", "Coastal", "Midnight", "Ember"];
const DESC = [
  "Designed in small runs and finished by hand, so every piece feels considered.",
  "Made from responsibly sourced materials with a focus on longevity over trend.",
  "A quiet, versatile staple that works across seasons and settings.",
  "Tested by our team for weeks before it earned a spot in the catalog.",
];

export function mulberry(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const BRANDS: Brand[] = BRAND_SEED.map(([id, name, cat, ph, tagline], i) => {
  const r = mulberry(i * 31 + 7);
  return { id, name, cat, ph, tagline, rating: (4.4 + r() * 0.5).toFixed(1), reviews: Math.round(300 + r() * 4500) };
});
export const BRAND_BY_ID: Record<string, Brand> = Object.fromEntries(BRANDS.map((b) => [b.id, b]));

export const PRODUCTS: Product[] = [];
BRANDS.forEach((b, bi) => {
  const cat = CATEGORIES[b.cat];
  const r = mulberry(bi * 97 + 13);
  cat.types.forEach(([plural, singular], ti) => {
    for (let k = 0; k < 2; k++) {
      const adj = ADJ[Math.floor(r() * ADJ.length)];
      // separate seed so adding sale prices never shifts the existing generated data
      const d = mulberry(bi * 131 + ti * 17 + k * 7 + 5);
      const pct = d() > 0.45 ? [10, 15, 20, 25, 30, 40][Math.floor(d() * 6)] : 0;
      const price = (18 + Math.floor(r() * 24) * 6) * 100 + (r() > 0.5 ? 0 : 50);
      PRODUCTS.push({
        id: `${b.id}-${ti}${k}`,
        brand: b.id,
        cat: b.cat,
        type: plural,
        name: `${b.name.split(/[ &]/)[0]} ${adj} ${singular}`,
        price,
        compareAt: pct ? Math.round(price / (1 - pct / 100) / 50) * 50 : undefined,
        rating: +(4.2 + r() * 0.7).toFixed(1),
        reviews: Math.round(12 + r() * 900),
        ph: k === 0 ? b.ph : PHS[Math.floor(r() * PHS.length)],
        alt: [0, 1, 2].map(() => PHS[Math.floor(r() * PHS.length)]),
        desc: DESC[Math.floor(r() * DESC.length)],
        isNew: r() > 0.8,
      });
    }
  });
});
export const PRODUCT_BY_ID: Record<string, Product> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const SORTS = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
} as const;

/** Whole-number percent off, or 0 when the product is not on sale. */
export const percentOff = (p: Product) => (p.compareAt && p.compareAt > p.price ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

const HIGHLIGHTS: Record<CategoryKey, string[]> = {
  women: ["Relaxed fit, true to size", "Breathable natural-blend fabric", "Machine washable on a gentle cycle"],
  men: ["Built for everyday wear", "Reinforced stitching at stress points", "Pairs with almost anything"],
  beauty: ["Dermatologist-tested formula", "Free from synthetic dyes", "Suitable for most skin types"],
  home: ["Made to be used daily", "Easy to clean and care for", "Neutral tones that suit any room"],
  baby: ["Soft on delicate skin", "Free from harsh chemicals", "Machine washable"],
  tech: ["Up to 24 hours of use per charge", "Fast USB-C charging", "One-year limited warranty"],
  food: ["Small-batch and freshly packed", "Ethically sourced ingredients", "Resealable pouch keeps it fresh"],
};
export const highlightsFor = (p: Product) => HIGHLIGHTS[p.cat];
