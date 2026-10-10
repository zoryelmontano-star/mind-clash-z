/* Shared no-repeat question rotation for Solo and Multiplayer. */
(function (root) {
  'use strict';
  const STORAGE_KEY = 'mind-clash-z-seen-questions-v1';
  const MAX_HISTORY = 1000;
  function key(value) {
    const text = typeof value === 'string' ? value : (value && value.q) || '';
    return String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }
  function shuffle(values) {
    const items = [...values];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  function extend(history, questions) {
    return [...(Array.isArray(history) ? history : []), ...questions.map(key).filter(Boolean)].slice(-MAX_HISTORY);
  }
  function pick(pool, count, history = [], preferSuperhard = false) {
    const unique = new Map();
    for (const question of pool) {
      const id = key(question);
      if (id && !unique.has(id)) unique.set(id, question);
    }
    if (!Number.isInteger(count) || count < 1 || unique.size < count) return null;
    const lastPlayed = new Map();
    (Array.isArray(history) ? history : []).forEach((value, i) => {
      const id = key(value);
      if (id) lastPlayed.set(id, i);
    });
    const age = question => lastPlayed.has(key(question)) ? lastPlayed.get(key(question)) : -1;
    const ordered = shuffle(unique.values()).sort((a, b) => age(a) - age(b));
    const selected = ordered.slice(0, count);
    // Include a surprise Super Hard when possible without sacrificing fresher questions.
    if (preferSuperhard && count >= 4 && !selected.some(q => q.diff === 'superhard')) {
      const bonus = ordered.find(q => q.diff === 'superhard' && !selected.includes(q));
      if (bonus && age(bonus) <= age(selected[selected.length - 1])) selected[selected.length - 1] = bonus;
    }
    return shuffle(selected);
  }
  function readHistory() {
    try {
      const stored = JSON.parse(root.localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored.filter(x => typeof x === 'string').slice(-MAX_HISTORY) : [];
    } catch { return []; }
  }
  function remember(questions) {
    const history = extend(readHistory(), questions);
    try { root.localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch {}
    return history;
  }
  root.MCZQuestionRotation = { key, pick, extend, readHistory, remember };
})(window);
