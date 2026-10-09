/* Mind Clash Z central audio director. No API secrets; browser voice fallback. */
(()=>{
'use strict';
const key='MCZ_AUDIO_V1';
const defaults={music:true,sfx:true,voice:true,volume:0.46,voiceName:''};
let state={...defaults};try{state={...state,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
let context=null,musicGain=null,fxGain=null,loop=null,step=0,playing=false,speaking=false,speechToken=0,lastTick=-1;
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
function init(){if(context)return context;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{context=new AC();musicGain=context.createGain();fxGain=context.createGain();musicGain.gain.value=0.0;fxGain.gain.value=Math.max(.01,state.volume*.28);musicGain.connect(context.destination);fxGain.connect(context.destination);return context}catch{return null}}
function unlock(){const c=init();if(c&&c.state==='suspended')c.resume().catch(()=>{});return !!c}
function duck(){if(!context||!musicGain)return;const target=playing&&state.music?state.volume*(speaking?.012:.09):0;musicGain.gain.cancelScheduledValues(context.currentTime);musicGain.gain.setTargetAtTime(target,context.currentTime,.075)}
function ping(freq,duration=.16,kind='triangle',power=.16,toMusic=false){const c=init();if(!c)return;if(!toMusic&&!state.sfx)return;const osc=c.createOscillator(),g=c.createGain(),now=c.currentTime;osc.type=kind;osc.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(power,now+.014);g.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(g);g.connect(toMusic?musicGain:fxGain);osc.start(now);osc.stop(now+duration+.01)}
const melody=[392,493.88,587.33,659.25,587.33,493.88,440,523.25,659.25,587.33,523.25,493.88,392,493.88,523.25,659.25];
function beat(){if(!playing||!state.music)return;const i=step++%melody.length;ping(melody[i],.21,'triangle',.34,true);if(i%4===0)ping(196,.27,'sine',.22,true);if(i%2===1)ping(1480,.055,'sine',.05,true)}
function startMusic(){playing=true;unlock();duck();if(!loop){beat();loop=setInterval(beat,248)}}
function stopMusic(){playing=false;clearInterval(loop);loop=null;duck()}
function setMusic(v){state.music=!!v;save();if(state.music&&playing)startMusic();else if(!state.music){clearInterval(loop);loop=null;duck()}}
function setSfx(v){state.sfx=!!v;save()}
function setVoice(v){state.voice=!!v;save();if(!state.voice)stopVoice()}
function setVolume(v){state.volume=Math.max(0,Math.min(1,Number(v)));save();if(fxGain)fxGain.gain.setTargetAtTime(Math.max(.001,state.volume*.28),context.currentTime,.05);duck()}
function voices(){if(!('speechSynthesis' in window))return[];return speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.toLowerCase().startsWith('en')).sort((a,b)=>score(b)-score(a))}
function score(v){const n=v.name.toLowerCase();return (/aria|jenny|samantha|zira|allison|ava|susan|female|google us english|natural/i.test(n)?10:0)+(v.localService?1:0)+(/en-us/i.test(v.lang)?2:0)}
function voiceName(n){state.voiceName=n||'';save()}
function stopVoice(){speechToken++;speaking=false;try{if('speechSynthesis'in window)speechSynthesis.cancel()}catch{}duck()}
function speak(txt,enabled=true){if(!enabled||!state.voice||!('speechSynthesis'in window))return false;stopVoice();const current=++speechToken;try{
const u=new SpeechSynthesisUtterance(String(txt));const candidates=voices();u.voice=candidates.find(v=>v.name===state.voiceName)||candidates[0]||null;u.lang=u.voice?.lang||'en-US';u.rate=1.07;u.pitch=1.18;u.volume=1;
u.onstart=()=>{if(current!==speechToken)return;speaking=true;duck()};const finish=()=>{if(current!==speechToken)return;speaking=false;duck()};u.onend=finish;u.onerror=finish;
speechSynthesis.speak(u);return true
}catch{speaking=false;duck();return false}}
function effect(type){if(!state.sfx)return;unlock();const seq={click:[[540,0],[740,90]],ready:[[520,0],[720,110]],go:[[740,0],[980,110],[1180,220]],correct:[[659,0],[830,100],[1046,200]],wrong:[[340,0],[275,110]],tick:[[640,0]],reveal:[[560,0],[780,110],[930,210]],pause:[[260,0]],resume:[[650,0]]}[type]||[[620,0]];seq.forEach(([hz,t])=>setTimeout(()=>ping(hz,.14,'triangle',.22),t))}
function bindControls(prefix=''){return state}
function announceQuestion(text,num){speak((num?'Question '+num+'. ':'')+text)}
window.MCZ=window.MCZ||{};
window.MCZ.audio={state,unlock,startMusic,stopMusic,setMusic,setSfx,setVoice,setVolume,voices,voiceName,stopVoice,speak,effect,announceQuestion,bindControls,ping};
window.MCZ.speak=speak;window.MCZ.stopVoice=stopVoice;
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice()});
})();