/* Čistá herní logika (bez DOM). */
const Game = {
  createSession(match) {
    return { match, picks: match.slots.map(() => null), evaluated: false, result: null };
  },
  /** Hráče lze vybrat jen ze soupisky daného turnaje. */
  isValidPick(match, name) {
    return match.roster.some(r => r.name === name);
  },
  setPick(session, index, name) {
    if (name !== null && !Game.isValidPick(session.match, name)) return false;
    session.picks[index] = name;
    return true;
  },
  /** Vyhodnocení nezávislé na pořadí, správně počítá opakované střelce. */
  evaluate(session) {
    const slots = session.match.slots;
    const remaining = {};
    slots.forEach(s => { if (s.answer) remaining[s.answer] = (remaining[s.answer] || 0) + 1; });
    const status = slots.map(() => null);
    // 1) přesné shody na stejné pozici
    slots.forEach((s, i) => {
      if (s.answer && session.picks[i] === s.answer) { status[i] = 'correct'; remaining[s.answer]--; }
    });
    // 2) shody v jiném pořadí
    slots.forEach((s, i) => {
      if (status[i]) return;
      const p = session.picks[i];
      if (!p) status[i] = 'empty';
      else if (remaining[p] > 0) { status[i] = 'correct'; remaining[p]--; }
      else status[i] = 'wrong';
    });
    // 3) nepřiřazení skuteční střelci se ukážou u špatných/prázdných polí
    const leftovers = [];
    slots.forEach(s => { if (s.answer && remaining[s.answer] > 0) { leftovers.push(s.answer); remaining[s.answer]--; } });
    const reveal = slots.map((s, i) => (status[i] === 'correct' ? session.picks[i] : leftovers.shift() || null));
    const gradable = slots.filter(s => s.answer).length;
    const correct = status.filter(x => x === 'correct').length;
    session.evaluated = true;
    session.result = { status, reveal, correct, total: gradable, empty: status.filter(x => x === 'empty').length };
    return session.result;
  }
};
