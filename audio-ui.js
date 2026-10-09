/* Shared sound console for both solo and multiplayer */
(()=>{
const e=document.getElementById('audioConsole');
if(!e||!window.MCZ?.audio)return;
const a=MCZ.audio;
e.innerHTML='<details class="audio-settings" id="acDetails"><summary>GAME AUDIO & VOICE</summary><div class="audio-fields"><label class="audio-toggle"><input type="checkbox" id="acMusic"> 🎵 Music</label><label class="audio-toggle"><input type="checkbox" id="acEffects"> ✨ Effects</label><label class="audio-toggle"><input type="checkbox" id="acVoice"> 🎙️ Narration</label><label class="audio-voice-picker">Voice: <select id="acVoices" aria-label="Select game host voice"><option value="">Automatic voice</option></select></label><label class="audio-volume">Volume <input id="acVolume" type="range" min="0" max="100" step="5" aria-label="Game volume"></label><button id="acSample" class="audio-test" type="button">▶ TEST GAME MASTER VOICE</button><div class="audio-status" id="acStatus" role="status">Tap Test Voice to hear the device narrator. A recorded AI voice will sound more consistent.</div></div></details>';
const $=id=>document.getElementById(id);
function mirror(){if($('music'))$('music').checked=a.state.music;if($('sfx'))$('sfx').checked=a.state.sfx;if($('voice'))$('voice').checked=a.state.voice;if($('voiceEnabled'))$('voiceEnabled').checked=a.state.voice}
function drawVoices(){const v=a.voices();const prev=$('acVoices').value||a.state.voiceName;$('acVoices').innerHTML='<option value="">Auto — cheerful English voice</option>';v.forEach(x=>{let opt=document.createElement('option');opt.textContent=x.name+' ('+x.lang+')';opt.value=x.name;$('acVoices').append(opt)});$('acVoices').value=v.some(x=>x.name===prev)?prev:'';if(!v.length)$('acStatus').textContent='Voice selection may not appear on iPhone. Tap Test Voice to try the device default narrator.'}
$('acMusic').checked=a.state.music;$('acEffects').checked=a.state.sfx;$('acVoice').checked=a.state.voice;$('acVolume').value=Math.round(a.state.volume*100);
$('acMusic').onchange=()=>{a.unlock();a.setMusic($('acMusic').checked);if(a.state.music)a.startMusic();else a.stopMusic();mirror()};
$('acEffects').onchange=()=>{a.setSfx($('acEffects').checked);if(a.state.sfx)a.effect('click');mirror()};
$('acVoice').onchange=()=>{a.setVoice($('acVoice').checked);mirror();$('acStatus').textContent=$('acVoice').checked?'Narration enabled. Tap Hear Game Master Z to preview.':'Narration off.'};
$('acVolume').oninput=()=>a.setVolume(Number($('acVolume').value)/100);
$('acVoices').onchange=()=>{a.voiceName($('acVoices').value);a.stopVoice()};
$('acSample').onclick=()=>{a.unlock();a.effect('ready');const ok=a.speak("Hey, brainiacs! Welcome to Mind Clash Z! I am your Game Master! Ready to battle those brains?",true);$('acStatus').textContent=ok?'Voice test started. On iPhone, narration may use the default voice even when the list is empty.':'Narration is off or unavailable. Turn it on to test.'};
$('acDetails').open=window.matchMedia('(min-width: 701px)').matches;drawVoices();if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',drawVoices);mirror();
})();