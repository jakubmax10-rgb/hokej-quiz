/* Našeptávač hráčů: ignoruje velikost písmen i diakritiku, nabízí jen hráče ze zadané soupisky. */
const Autocomplete = {
  /** Vrací seřazené hráče odpovídající dotazu (po slovech; předpona má přednost před částí jména). */
  search(roster, query) {
    const q = Utils.normalize(query);
    if (!q) return roster.slice().sort((a, b) => Autocomplete._surname(a).localeCompare(Autocomplete._surname(b), 'cs'));
    const tokens = q.split(/\s+/);
    const tier1 = [], tier2 = [];
    for (const p of roster) {
      const n = Utils.normalize(p.name), words = n.split(/\s+/);
      if (tokens.every(t => words.some(w => w.startsWith(t)))) tier1.push(p);
      else if (q.length >= 2 && tokens.every(t => n.includes(t))) tier2.push(p);
    }
    const byName = (a, b) => Autocomplete._surname(a).localeCompare(Autocomplete._surname(b), 'cs');
    // předpona příjmení před předponou křestního jména
    tier1.sort((a, b) => {
      const sa = Utils.normalize(Autocomplete._surname(a)).startsWith(tokens[tokens.length - 1]) ? 0 : 1;
      const sb = Utils.normalize(Autocomplete._surname(b)).startsWith(tokens[tokens.length - 1]) ? 0 : 1;
      return sa - sb || byName(a, b);
    });
    return tier1.concat(tier2.sort(byName));
  },
  _surname(p) { return p.name.split(' ').slice(1).join(' '); },

  /** Připojí našeptávač k poli. onSelect(name|null) se volá při změně výběru. */
  attach(wrapper, roster, onSelect) {
    const { h } = Utils;
    const input = h('input', { type: 'text', class: 'slot-input', placeholder: 'Zadejte českého střelce…', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Český střelec' });
    const list = h('ul', { class: 'ac-list', role: 'listbox', hidden: true });
    wrapper.append(input, list);
    let selected = null, items = [], active = -1;

    const close = () => { list.hidden = true; active = -1; };
    const render = () => {
      items = Autocomplete.search(roster, input.value);
      list.replaceChildren();
      if (!items.length) { list.append(h('li', { class: 'ac-empty' }, 'Žádný hráč v soupisce')); }
      items.forEach((p, i) => {
        const li = h('li', { class: 'ac-item', role: 'option' },
          h('span', { class: 'ac-num' }, '#' + p.number),
          h('span', { class: 'ac-name' }, p.name),
          h('span', { class: 'ac-pos' }, ({ Forward: 'Útočník', Defender: 'Obránce', Goalkeeper: 'Brankář' })[p.position] || p.position));
        li.addEventListener('mousedown', e => { e.preventDefault(); choose(p); });
        li.addEventListener('mouseenter', () => highlight(i));
        list.append(li);
      });
      list.hidden = false; highlight(items.length ? 0 : -1);
    };
    const highlight = i => {
      active = i;
      [...list.querySelectorAll('.ac-item')].forEach((li, k) => li.classList.toggle('active', k === i));
      const el = list.querySelectorAll('.ac-item')[i]; if (el) el.scrollIntoView({ block: 'nearest' });
    };
    const choose = p => {
      selected = p.name; input.value = p.name; wrapper.classList.add('filled'); close(); onSelect(selected);
    };
    input.addEventListener('focus', () => { input.select(); render(); });
    input.addEventListener('input', () => {
      if (selected) { selected = null; wrapper.classList.remove('filled'); onSelect(null); }
      render();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); else highlight(Math.min(active + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (!list.hidden && items[active]) choose(items[active]); }
      else if (e.key === 'Escape') { close(); }
    });
    input.addEventListener('blur', () => { close(); input.value = selected || ''; });
    return {
      input,
      lock() { input.disabled = true; wrapper.classList.add('locked'); },
      unlock() { input.disabled = false; wrapper.classList.remove('locked'); }
    };
  }
};
