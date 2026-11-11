/* Pomocné funkce */
const Utils = {
  /** Odstraní diakritiku a převede na malá písmena. */
  normalize(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  },
  /** Mini helper pro tvorbu DOM prvků. */
  h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(c));
    }
    return el;
  },
  parseDate(str) {
    const [d, m, y] = str.split('.').map(Number);
    return new Date(y, m - 1, d);
  },
  formatDate(str) {
    const [d, m, y] = str.split('.').map(Number);
    return `${d}. ${m}. ${y}`;
  }
};
