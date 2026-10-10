// Run with: node qa-multiplayer.cjs
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('./multiplayer-core.js');
const source = fs.readFileSync('questions.js', 'utf8');
const sourceForTest = source.replace(/export const /g, 'const ');
const bank = vm.runInNewContext(sourceForTest + '\nQUESTIONS;');
const raw = vm.runInNewContext(sourceForTest + '\nRAW;');
const fakeWindow = {localStorage:{getItem:() => null, setItem:() => {}}};
vm.runInNewContext(fs.readFileSync('question-rotation.js','utf8'), {window:fakeWindow});
const rotation = fakeWindow.MCZQuestionRotation;
const points = {easy:100, medium:200, hard:300, superhard:600};
const categories = [...new Set(bank.map(q => q.cat))];
const difficulties = ['easy', 'medium', 'hard', 'superhard'];
assert.equal(bank.length,600, 'Question bank size');
assert.equal(categories.length,21, 'All categories');
assert.equal(new Set(bank.map(rotation.key)).size,bank.length, 'Unique questions');
let checked = 0;
for(let i=0;i<bank.length;i++){
  const q=bank[i], original=raw[i];
  assert.equal(q.opts.length,4);
  assert.ok(Number.isInteger(q.correct) && q.correct>=0 && q.correct<4);
  assert.equal(q.opts[q.correct], original[3][original[4]], 'Answer shuffle integrity');
  const players=Object.fromEntries([0,1,2,3].map(i=>['p'+i,{name:'Player '+i,score:100,clientVersion:core.version}]));
  const answers={p0:0,p1:1,p2:2,p3:3,outsider:0};
  const tally=core.tally(answers,players);
  assert.equal(tally.total,4,'All four registered players counted');
  assert.equal(tally.counts.join(','),'1,1,1,1','All four vote options counted');
  const award=core.award(players,answers,q,points);
  assert.equal(Object.keys(award).length,1,'Only correct answer scored');
  assert.equal(award['players/p'+q.correct+'/score'],100+points[q.diff]);
  assert.equal(core.tally({p0:0,p1:null,p2:'2',outsider:1},players).total,1);
  checked++;
}
for(const cat of categories){
  const all=bank.filter(q=>q.cat===cat);
  assert.ok(all.length>=28 && all.length<=29,'Expected 28 or 29 questions in '+cat);
  const a=rotation.pick(all,4,[],true);
  const b=rotation.pick(all,4,rotation.extend([],a),true);
  assert.equal(new Set([...a,...b].map(q=>q.id)).size,8,'Premature repeat in '+cat);
  let used=[];
  for(let i=0;i<all.length;i++){
    const next=rotation.pick(all,1,used,false);
    assert.ok(next && next.length===1,'A fresh question must exist while available');
    assert.equal(rotation.remaining(all,used).length,all.length-i);
    used=rotation.extend(used,next);
  }
  assert.equal(rotation.pick(all,1,used,false),null,'Questions must never cycle after exhaustion: '+cat);
  for(const diff of difficulties){
    assert.ok(all.filter(q=>q.diff===diff).length>=7,cat+' / '+diff);
    checked++;
  }
}
assert.notEqual(core.roundKey({matchId:'gameA',round:0}),core.roundKey({matchId:'gameB',round:0}),'Rematch answer isolation');
assert.equal(core.outOfDate({a:{clientVersion:core.version},b:{name:'Old browser'}}).length,1,'Stale client rejected');
assert.equal(core.tally({a:0,b:0},{a:{},b:{}}).total,2,'Answer A is not falsy');
const positionDistribution=[0,1,2,3].map(i=>bank.filter(q=>q.correct===i).length);
assert.equal(positionDistribution.join(','),'150,150,150,150','Correct answer letter balance');
for(const q of bank){
  assert.equal(new Set(q.opts.map(a=>a.toLowerCase())).size,4,'Unique answer options: '+q.id);
  assert.ok(q.trivia && q.trivia.length>=25,'Explanations must contain a useful reason: '+q.id);
}
const multiplayer=fs.readFileSync('multiplayer.html','utf8');
const solo=fs.readFileSync('index.html','utf8');
for(const id of ['resultsModal','closeResults','showResults','revealPanel','leaderboard','rematchCategory']){
  assert.ok(multiplayer.includes('id="'+id+'"'),'Popup UI element missing: '+id);
}
assert.ok(multiplayer.includes("from'./questions.js?v=20261009c'"),'Multiplayer uses updated bank');
assert.ok(solo.includes("from './questions.js?v=20261009c'"),'Solo uses updated bank');
assert.ok(multiplayer.includes("MCZQuestionRotation.remaining(eligible)"),'Multiplayer must count only unseen questions');
assert.ok(solo.includes("MCZQuestionRotation.remaining(pool)"),'Solo must count only unseen questions');
assert.ok(multiplayer.includes("$('questionImage').innerHTML=''"),'Duplicate question illustration removed');
assert.ok(multiplayer.includes("room.settings"),'Room settings must persist');
console.log('PASS '+checked+' cases across '+categories.length+' categories. Voting, scoring, shuffling, version checks, rematches verified.');
