/* Vykreslení obrazovek. */
const UI = (() => {
  const { h } = Utils;
  const root = () => document.getElementById('app');

  function flag(code, size = 'md') {
    const t = DataAdapter.teamInfo(code);
    const img = h('img', { class: `flag flag-${size}`, alt: t.name, loading: 'lazy',
      src: t.flag ? `https://flagcdn.com/w80/${t.flag}.png` : '' });
    img.addEventListener('error', () => img.replaceWith(h('span', { class: `flag flag-${size} flag-fallback` }, code)));
    return img;
  }
  const icon = type => h('span', { class: `ev-icon ev-${type}`, 'aria-hidden': 'true' },
    type === 'goal' ? '🏒' : type === 'penalty' ? '⏱' : 'ℹ');
  const fmtDuration = d => (typeof d === 'number' ? `${d} min` : String(d));
  const posCs = p => ({ Forward: 'Útočník', Defender: 'Obránce', Goalkeeper: 'Brankář' })[p] || p;

  /* ---------- Domovská obrazovka ---------- */
  function renderHome(state, actions) {
    const prog = Store.load();
    const all = state.tournaments.flatMap(t => t.matches);
    const played = all.filter(m => prog[m.id]);
    const sumCorrect = played.reduce((s, m) => s + prog[m.id].best, 0);
    const sumTotal = played.reduce((s, m) => s + (prog[m.id].total || m.slots.length), 0);
    const tour = state.tournaments.find(t => t.id === state.tournamentId) || state.tournaments[0];

    const stats = h('div', { class: 'stats' },
      stat('Odehráno zápasů', `${played.length}/${all.length}`),
      stat('Správně určeno', `${sumCorrect}/${sumTotal}`),
      stat('Úspěšnost', sumTotal ? Math.round(sumCorrect / sumTotal * 100) + ' %' : '–'));

    // Opraveno: Kontejner pro záložky s čistým přetečením (scrollbar/slider)
    const tabs = h('div', { class: 'tabs', role: 'tablist' }, state.tournaments.map(t =>
      h('button', { class: 'tab' + (t.id === tour.id ? ' active' : ''), role: 'tab', onclick: () => actions.selectTournament(t.id) }, t.name)));

    const list = h('div', { class: 'match-list' }, tour.matches.map(m => matchCard(m, prog[m.id], actions)));

    root().replaceChildren(h('section', { class: 'home fade-in' },
      h('header', { class: 'hero' },
        h('div', { class: 'hero-flag' }, flag('CZE', 'lg')),
        h('div', {}, h('h1', {}, 'Hádej české střelce'), h('p', {}, 'Doplň, kdo vstřelil góly českého národního týmu.'))),
      stats, tabs,
      h('div', { class: 'toolbar' },
        h('span', { class: 'muted' }, `${tour.name} · ${tour.matches.length} zápasů · soupiska ${tour.roster.length} hráčů`),
        h('div', { class: 'toolbar-btns' },
          h('button', { class: 'btn btn-primary', onclick: () => actions.randomMatch(tour.id) }, '🎲 Náhodný zápas'),
          h('button', { class: 'btn btn-ghost', onclick: actions.resetProgress }, 'Vynulovat postup'))),
      list));
  }
  const stat = (label, value) => h('div', { class: 'stat' }, h('div', { class: 'stat-v' }, value), h('div', { class: 'stat-l' }, label));

  function matchCard(m, progress, actions) {
    const meta = [Utils.formatDate(m.date), m.stage, m.decision && m.decision !== 'Konec' ? m.decision : null].filter(Boolean).join(' · ');
    return h('button', { class: 'match-card' + (progress ? ' played' : ''), onclick: () => actions.openMatch(m) },
      h('div', { class: 'mc-meta' }, meta),
      h('div', { class: 'mc-teams' },
        h('span', { class: 'mc-team' }, flag(m.home, 'sm'), DataAdapter.teamInfo(m.home).name),
        h('span', { class: 'mc-score' }, m.score),
        h('span', { class: 'mc-team right' }, DataAdapter.teamInfo(m.away).name, flag(m.away, 'sm'))),
      h('div', { class: 'mc-foot' },
        h('span', { class: 'muted' }, `${m.slots.length} ${m.slots.length === 1 ? 'český gól' : m.slots.length < 5 ? 'české góly' : 'českých gólů'}`),
        progress ? h('span', { class: 'badge' }, `${progress.best}/${progress.total} ✓`) : h('span', { class: 'badge badge-new' }, 'Nehráno')));
  }

  /* ---------- Herní obrazovka ---------- */
  function renderMatch(session, state, actions) {
    const m = session.match;
    const controls = {};            // slot index -> { wrapper, ac }
    const root_ = h('section', { class: 'match fade-in' });

    const header = h('div', { class: 'scoreboard' },
      h('div', { class: 'sb-meta' }, [m.tournamentName, Utils.formatDate(m.date), m.stage, m.decision && m.decision !== 'Konec' ? m.decision : null].filter(Boolean).join(' · ')),
      h('div', { class: 'sb-main' },
        h('div', { class: 'sb-team' }, flag(m.home, 'lg'), h('span', {}, DataAdapter.teamInfo(m.home).name)),
        h('div', { class: 'sb-score' }, m.score),
        h('div', { class: 'sb-team' }, flag(m.away, 'lg'), h('span', {}, DataAdapter.teamInfo(m.away).name))),
      h('div', { class: 'sb-periods' }, m.periods.filter(p => p.key !== 'shootouts').map(p =>
        h('span', {}, `${p.label.replace(' třetina', '.')}: ${p.scoreHome}:${p.scoreAway}`))));

    const timeline = h('div', { class: 'timeline' });
    for (const p of m.periods) {
      const sec = h('div', { class: 'period' }, h('div', { class: 'period-head' }, h('span', {}, p.label),
        h('span', { class: 'period-score' }, `${p.scoreHome}:${p.scoreAway}`)));
      if (p.key === 'shootouts') {
        p.attempts.forEach(a => {
          const isCz = a.team === m.czSide;
          sec.append(h('div', { class: 'ev so' },
            h('div', { class: 'ev-time' }, `${a.round}. série`),
            h('span', { class: 'ev-icon ' + (a.scored ? 'ev-goal' : 'ev-miss'), 'aria-hidden': 'true' }, a.scored ? '✔' : '✖'),
            h('div', { class: 'ev-body' },
              h('div', { class: 'ev-main' }, flag(isCz ? 'CZE' : m.opponent, 'xs'), isCz ? 'Český hráč' : a.player,
                h('span', { class: 'tag ' + (a.scored ? 'tag-ok' : 'tag-no') }, a.scored ? 'Gól' : 'Neproměněno')))));
        });
      } else if (!p.events.length) {
        sec.append(h('div', { class: 'ev-empty' }, 'Žádné události'));
      }
      for (const e of p.events) sec.append(eventRow(e, m, session, controls, actions));
      timeline.append(sec);
    }

    const panel = h('div', { class: 'action-bar' });
    const resultBox = h('div', { class: 'result-box', hidden: true });
    root_.append(
      h('button', { class: 'back', onclick: actions.goHome }, '← Zpět na přehled'),
      header,
      h('div', { class: 'hint' }, m.slots.length
        ? `Doplň ${m.slots.length === 1 ? 'střelce' : 'střelce všech ' + m.slots.length + ' českých gólů'}. Nabízejí se hráči ze soupisky turnaje ${m.tournamentName}.`
        : 'V tomto zápase nejsou v databázi žádné české góly.'),
      timeline, resultBox, panel);

    const evalBtn = h('button', { class: 'btn btn-primary btn-lg', onclick: () => doEvaluate() }, 'Vyhodnotit zápas');
    const skipBtn = h('button', { class: 'btn btn-ghost', onclick: actions.nextMatch }, 'Přeskočit zápas');
    panel.append(evalBtn, skipBtn);
    const updateBtn = () => {
      const n = session.picks.filter(Boolean).length;
      evalBtn.textContent = `Vyhodnotit zápas (${n}/${m.slots.length})`;
    };
    updateBtn();
    session._updateBtn = updateBtn;

    function doEvaluate() {
      if (session.evaluated) return;
      const res = Game.evaluate(session);
      Store.record(m.id, res.correct, res.total);
      Object.values(controls).forEach(c => c.ac.lock());
      res.status.forEach((st, i) => setTimeout(() => {
        const c = controls[i]; if (!c) return;
        c.wrapper.classList.remove('filled');
        c.wrapper.classList.add('graded', 'graded-' + st);
        const mark = h('span', { class: 'mark' }, st === 'correct' ? '✔' : st === 'wrong' ? '✖' : '?');
        c.wrapper.append(mark);
        if (st !== 'correct') {
          const rv = res.reveal[i];
          if (st === 'empty') c.ac.input.value = 'Nezodpovězeno';
          c.wrapper.append(h('div', { class: 'reveal' }, rv ? `Správně: ${rv}` : 'Střelce nelze určit'));
        }
      }, 250 + i * 350));
      setTimeout(() => {
        const label = res.correct === res.total ? 'Perfektní zápas! 🎉' : res.correct === 0 ? 'Tentokrát bez zásahu' : 'Dobrá práce';
        resultBox.hidden = false;
        resultBox.replaceChildren(
          h('div', { class: 'result-score' }, `${res.correct}/${res.total}`),
          h('div', { class: 'result-label' }, label),
          h('div', { class: 'muted' }, 'Skuteční střelci: ' + m.slots.map(s => s.answer || s.rawName).join(', ') + (res.empty ? ` · nezodpovězeno: ${res.empty}` : '')));
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        panel.replaceChildren(
          h('button', { class: 'btn btn-primary btn-lg', onclick: actions.nextMatch }, 'Další zápas'),
          h('button', { class: 'btn btn-ghost', onclick: () => actions.openMatch(m) }, 'Zahrát znovu'),
          h('button', { class: 'btn btn-ghost', onclick: actions.goHome }, 'Přehled zápasů'));
      }, 400 + m.slots.length * 350);
    }

    root().replaceChildren(root_);
    window.scrollTo({ top: 0 });
  }

  function eventRow(e, m, session, controls, actions) {
    const side = e.team === m.czSide ? 'cz' : 'opp';
    const teamCode = e.team === 'home' ? m.home : m.away;
    if (e.type === 'goal') {
      const row = h('div', { class: `ev goal ${side}` }, h('div', { class: 'ev-time' }, e.time), icon('goal'));
      const body = h('div', { class: 'ev-body' });
      const main = h('div', { class: 'ev-main' }, flag(teamCode, 'xs'), h('strong', {}, 'GÓL'),
        h('span', { class: 'run-score' }, `${DataAdapter.teamInfo(teamCode).name} ${e.runningScore}`));
      body.append(main);
      if (e.slot && e.slot.answer) {
        const wrapper = h('div', { class: 'slot' });
        body.append(wrapper);
        const ac = Autocomplete.attach(wrapper, m.roster, name => { Game.setPick(session, e.slot.index, name); session._updateBtn && session._updateBtn(); });
        controls[e.slot.index] = { wrapper, ac };
      } else {
        body.append(h('div', { class: 'scorer' }, e.player));
      }
      const sub = [];
      if (e.assists && e.assists.length) sub.push('Asistence: ' + e.assists.join(', '));
      if (e.note) sub.push(e.note);
      if (sub.length) body.append(h('div', { class: 'ev-sub' }, sub.join(' · ')));
      row.append(body);
      return row;
    }
    if (e.type === 'penalty') {
      return h('div', { class: `ev penalty ${side}` }, h('div', { class: 'ev-time' }, e.time), icon('penalty'),
        h('div', { class: 'ev-body' },
          h('div', { class: 'ev-main' }, flag(teamCode, 'xs'), h('span', {}, 'Trest'), h('span', { class: 'dur' }, fmtDuration(e.duration))),
          h('div', { class: 'scorer' }, e.player),
          e.reason && h('div', { class: 'ev-sub' }, e.reason)));
    }
    return h('div', { class: 'ev other' }, h('div', { class: 'ev-time' }, e.time), icon('other'),
      h('div', { class: 'ev-body' }, h('div', { class: 'ev-main' }, e.note || '')));
  }

  return { renderHome, renderMatch };
})();