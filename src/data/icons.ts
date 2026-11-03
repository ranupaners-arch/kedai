export const ICON: Record<string, string> = {
  home: '<path d="M4 11l8-7 8 7v9H4z"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
  bag: '<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2"/>',
  orders: '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/>',
  dots: '<path d="M5 12h.01M12 12h.01M19 12h.01" stroke-width="3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  women: '<path d="M12 4v8m0 0a4 4 0 100-8 4 4 0 000 8zm0 0v8m-3-3h6"/>',
  men: '<circle cx="10" cy="14" r="4"/><path d="M14 10l6-6m0 0h-4m4 0v4"/>',
  beauty: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
  baby: '<circle cx="12" cy="12" r="7"/><path d="M9 13c1 1.5 5 1.5 6 0M9.5 9.5h.01M14.5 9.5h.01"/>',
  tech: '<rect x="5" y="4" width="14" height="12" rx="2"/><path d="M3 20h18"/>',
  food: '<path d="M6 3v8a3 3 0 006 0V3M9 3v18M18 3c-2 2-3 5-3 8h3v10"/>',
};
export const STAR_SVG =
  '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 .5l1.2 2.9 3.1.3-2.4 2 .8 3.1L5 7.2 2.3 8.8l.8-3.1-2.4-2 3.1-.3z"/></svg>';
export const icon = (name: string, cls = "") =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name] ?? ""}</svg>`;
