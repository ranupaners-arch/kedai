# Credits

## Made by

**Ranupane** · **KukerjainAja**

The Kedai name, wordmark and logo mark (`public/favicon.svg`, `src/components/LogoMark.astro`) are original artwork by KukerjainAja and are covered by the project's [MIT license](LICENSE).

## Third-party material

These keep their own licenses; the MIT license in this repository does not apply to them.

### Home hero background — `public/images/hero-bg.jpg`

- Photo: "A soft gradient shifting from pale yellow to pink and light blue" by **MagicPattern**
- Source: https://unsplash.com/photos/yellow-pink-and-blue-gradient-oPH_5xuMgQw
- License: [Unsplash License](https://unsplash.com/license) — free to use, including commercially; attribution is appreciated but not required.
- Resized to 1920px wide and recompressed for the web.

### Catalog and category photos

The generated demo catalog uses category-matched photos for product cards and brand cards. Home category tiles and the homepage carousel use the same category photos.

| Asset | Photo and source |
| --- | --- |
| `public/images/women.jpg` | "Woman in stylish outfit poses under studio light" by lhon karwan — https://unsplash.com/photos/woman-in-stylish-outfit-poses-under-studio-light-pKR9xg3ABxU |
| `public/images/beauty.jpg` | "Skincare products arranged on a table" by Ela De Pure — https://unsplash.com/photos/skincare-products-arranged-on-a-table-dtE5DeFUa1U |
| `public/images/home.jpg` | "Green plant on white ceramic vase" by Andrea Davis — https://unsplash.com/photos/green-plant-on-white-ceramic-vase-9FpWLxcLztI |
| `public/images/baby.jpg` | "Baby clothes, sandals, and toy camera flat lay" by Amanda Selby — https://unsplash.com/photos/baby-clothes-sandals-and-toy-camera-flat-lay-72l_I4s-hss |
| `public/images/food.jpg` | "A brown paper bag full of coffee beans" by engin akyurt — https://unsplash.com/photos/a-brown-paper-bag-full-of-coffee-beans--fHykZfnjJA |
| `public/images/tech.jpg` | "White apple earpods beside white ceramic mug" by Marine Sintes — https://unsplash.com/photos/white-apple-earpods-beside-white-ceramic-mug-y0CoNS0YXyc |

All local category photos are available under the [Unsplash License](https://unsplash.com/license), including for commercial use; attribution is appreciated but not required. Each was downloaded as a local 1200px-wide JPEG. The men's demo catalog reuses the fashion photo because the available photo set has no dedicated menswear image.

Each generated product SKU uses a different stable seed based on its displayed name and SKU ID through [Picsum Photos](https://picsum.photos/). These per-product images are loaded from Picsum at runtime. The local category and hero images above remain Unsplash photos.

### Typeface — Inter

- Self-hosted through the [`@fontsource-variable/inter`](https://fontsource.org/fonts/inter) package.
- Inter is by Rasmus Andersson, licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/).
