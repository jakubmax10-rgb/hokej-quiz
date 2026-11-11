/* Převod existujících databází na model pro hru. Data se nijak nemění ani nedoplňují. */
const DataAdapter = (() => {
  const PERIOD_LABELS = { p1: '1. třetina', p2: '2. třetina', p3: '3. třetina', overtime: 'Prodloužení', shootouts: 'Nájezdy' };
  const PERIOD_ORDER = ['p1', 'p2', 'p3', 'overtime', 'shootouts'];

  function teamInfo(code) {
    return CONFIG.teams[code] || { name: code, flag: null };
  }

  /** Najde hráče v soupisce podle zápisu "Příjmení I." */
  function resolveScorer(tournamentId, roster, rawName) {
    const alias = CONFIG.aliases[`${tournamentId}|${rawName}`];
    if (alias) return roster.find(r => r.name === alias) || null;
    const parts = rawName.trim().split(/\s+/);
    const initial = /\.$/.test(parts[parts.length - 1]) ? parts.pop() : '';
    const surname = Utils.normalize(parts.join(' '));
    let c = roster.filter(r => Utils.normalize(r.name.split(' ').slice(1).join(' ')) === surname);
    if (c.length > 1 && initial) {
      const f = c.filter(r => Utils.normalize(r.name[0]) === Utils.normalize(initial[0]));
      if (f.length) c = f;
    }
    return c.length === 1 ? c[0] : null;
  }

  function buildMatch(t, raw, roster) {
    const czSide = raw.home_team === 'CZE' ? 'home' : 'away';
    const m = {
      id: raw.id, tournamentId: t.id, tournamentName: t.name, date: raw.date,
      stage: raw.stage || null, decision: raw.decision || null, score: raw.score,
      home: raw.home_team, away: raw.away_team, czSide,
      opponent: czSide === 'home' ? raw.away_team : raw.home_team,
      periods: [], slots: [], roster
    };
    let h = 0, a = 0;
    for (const key of PERIOD_ORDER) {
      const p = raw.periods && raw.periods[key];
      if (!p) continue;
      const period = { key, label: PERIOD_LABELS[key], scoreHome: p.score_home, scoreAway: p.score_away, events: [], attempts: null };
      if (key === 'shootouts') {
        period.attempts = (p.attempts || []).map(x => ({ ...x }));
      } else {
        const evs = (p.events || []).map((e, i) => ({ e, i }))
          .sort((x, y) => x.e.time.localeCompare(y.e.time) || x.i - y.i).map(x => x.e);
        for (const e of evs) {
          const ev = { ...e };
          if (e.type === 'goal') {
            e.team === 'home' ? h++ : a++;
            ev.runningScore = `${h}:${a}`;
            if (e.team === czSide) {
              const player = resolveScorer(t.id, roster, e.player);
              if (!player) console.warn('Střelce se nepodařilo spárovat se soupiskou:', raw.id, e.player);
              const slot = { index: m.slots.length, answer: player ? player.name : null, rawName: e.player };
              m.slots.push(slot);
              ev.slot = slot;
            }
          }
          period.events.push(ev);
        }
      }
      m.periods.push(period);
    }
    return m;
  }

  function load() {
    return CONFIG.tournaments.map(t => {
      const roster = t.roster();
      const matches = t.matches().map(raw => buildMatch(t, raw, roster))
        .sort((x, y) => Utils.parseDate(x.date) - Utils.parseDate(y.date));
      return { id: t.id, name: t.name, roster, matches };
    });
  }
  return { load, teamInfo };
})();
