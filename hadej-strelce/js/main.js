/* Řízení aplikace: stav a navigace. */
(function () {
  const state = { tournaments: DataAdapter.load(), tournamentId: 'beijer', session: null };
  const tourOf = id => state.tournaments.find(t => t.id === id);

  const actions = {
    selectTournament(id) { state.tournamentId = id; show(); },
    openMatch(m) { state.tournamentId = m.tournamentId; state.session = Game.createSession(m); UI.renderMatch(state.session, state, actions); },
    randomMatch(tid) {
      const prog = Store.load();
      const ms = tourOf(tid).matches;
      const unplayed = ms.filter(m => !prog[m.id]);
      const pool = unplayed.length ? unplayed : ms;
      actions.openMatch(pool[Math.floor(Math.random() * pool.length)]);
    },
    nextMatch() {
      const prog = Store.load(), cur = state.session && state.session.match;
      const ms = tourOf(state.tournamentId).matches.filter(m => !cur || m.id !== cur.id);
      const pool = ms.filter(m => !prog[m.id]);
      const list = pool.length ? pool : ms;
      if (!list.length) return actions.goHome();
      actions.openMatch(list[Math.floor(Math.random() * list.length)]);
    },
    goHome() { state.session = null; show(); },
    resetProgress() { if (confirm('Opravdu vynulovat veškerý postup?')) { Store.reset(); show(); } }
  };
  function show() { UI.renderHome(state, actions); window.scrollTo({ top: 0 }); }
  show();
})();
