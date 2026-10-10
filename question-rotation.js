/* Mind Clash Z question rotation: never replay a question while history is retained. */
(function (root) {
  'use strict';
  const KEY = 'mind-clash-z-seen-questions-v2-600';
  const LEGACY_KEY = 'mind-clash-z-seen-questions-v1';
  function key(value) {
    const text = typeof value === 'string' ? value : (value && value.q) || '';
    return String(text).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
  }
  function shuffle(values) {
    const arr = [...values];
    for(let i=arr.length-1;i>0;i--){
      const a = Math.floor(Math.random()*(i+1));
      [arr[i],arr[a]]=[arr[a],arr[i]];
    }
    return arr;
  }
  function extend(history,questions) {
    return [...new Set([...(history||[]).map(key),...questions.map(key)].filter(Boolean))];
  }
  function readHistory() {
    try {
      const next = JSON.parse(root.localStorage.getItem(KEY)||'[]');
      const older = JSON.parse(root.localStorage.getItem(LEGACY_KEY)||'[]');
      return extend(Array.isArray(next)?next:[],Array.isArray(older)?older:[]);
    }catch{return [];}
  }
  function remaining(pool,history=readHistory()) {
    const used = new Set(history.map(key));
    const unique = new Map();
    for(const q of pool) {const k=key(q);if(k&&!used.has(k)&&!unique.has(k))unique.set(k,q);}
    return [...unique.values()];
  }
  function pick(pool,count,history=readHistory(),preferSuperhard=false){
    const fresh = remaining(pool,history);
    if(!Number.isInteger(count)||count<1||fresh.length<count)return null;
    // Prefer the new question batch until it runs low. Randomize independently for every match.
    const newer=shuffle(fresh.filter(q=>q.id>168));
    const original=shuffle(fresh.filter(q=>q.id<=168));
    let selection=[...newer,...original].slice(0,count);
    if(preferSuperhard&&count>=4&&!selection.some(q=>q.diff==='superhard')){
      const candidate=[...newer,...original].find(q=>q.diff==='superhard'&&!selection.includes(q));
      if(candidate)selection[count-1]=candidate;
    }
    return shuffle(selection);
  }
  function remember(questions) {
    const result=extend(readHistory(),questions);
    try {root.localStorage.setItem(KEY,JSON.stringify(result));}catch{}
    return result;
  }
  root.MCZQuestionRotation={key,shuffle,extend,remaining,pick,readHistory,remember};
})(window);
