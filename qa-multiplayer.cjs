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
assert.equal(bank.length,168, 'Question bank size');
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
  assert.equal(all.length,8,'Missing questions in '+cat);
  const a=rotation.pick(all,4,[],true);
  const b=rotation.pick(all,4,rotation.extend([],a),true);
  assert.equal(new Set([...a,...b].map(q=>q.id)).size,8,'Premature repeat in '+cat);
  for(const diff of difficulties){
    assert.equal(all.filter(q=>q.diff===diff).length,2,cat+' / '+diff);
    checked++;
  }
}
assert.notEqual(core.roundKey({matchId:'gameA',round:0}),core.roundKey({matchId:'gameB',round:0}),'Rematch answer isolation');
assert.equal(core.outOfDate({a:{clientVersion:core.version},b:{name:'Old browser'}}).length,1,'Stale client rejected');
assert.equal(core.tally({a:0,b:0},{a:{},b:{}}).total,2,'Answer A is not falsy');
console.log('PASS '+checked+' cases across '+categories.length+' categories. Voting, scoring, shuffling, version checks, rematches verified.');
