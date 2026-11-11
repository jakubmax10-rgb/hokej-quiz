/* Ukládání postupu hráče (localStorage, případná chyba se tiše ignoruje). */
const Store = {
  key: 'hadej-strelce-v1',
  load() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (e) { return {}; } },
  save(d) { try { localStorage.setItem(this.key, JSON.stringify(d)); } catch (e) {} },
  record(matchId, correct, total) {
    const d = this.load(); const prev = d[matchId];
    d[matchId] = { correct, total, plays: (prev ? prev.plays : 0) + 1, best: Math.max(correct, prev ? prev.best : 0) };
    this.save(d);
  },
  reset() { try { localStorage.removeItem(this.key); } catch (e) {} }
};
