/* Shared sound console for both solo and multiplayer */
(()=>{
const e=document.getElementById('audioConsole');
if(!e||!window.MCZ?.audio)return;
const a=MCZ.audio;
e.innerHTML='<label><input type="checkbox" id="acMusic"> 🎵 Music</label><label><input type="checkbox" id="acEffects"> ✨ Effects</label><label><input type="checkbox" id="acVoice"> 🎙️ Narration</label><label>Voice: <select id="acVoices" aria-label="Select game host voice"><option value="">Best available cheerful voice</option></select></label><label>Volume <input id="acVolume" type="range" min="0" max="100" step="5" aria-label="Game volume"></label><button id="acSample" type="button">▶ HEAR GAME MASTER Z</button><div class="audio-status" id="acStatus" role="status">Music and sound unlock when you press Play or Test Voice.</div>';
const $=id=>document.getElementById(id);
function mirror(){if($('music'))$('music').checked=a.state.music;if($('sfx'))$('sfx').checked=a.state.sfx;if($('voice'))$('voice').checked=a.state.voice;if($('voiceEnabled'))$('voiceEnabled').checked=a.state.voice}
function drawVoices(){const v=a.voices();const prev=$('acVoices').value||a.state.voiceName;$('acVoices').innerHTML='<option value="">Auto — cheerful English voice</option>';v.forEach(x=>{let opt=document.createElement('option');opt.textContent=x.name+' ('+x.lang+')';opt.value=x.name;$('acVoices').append(opt)});$('acVoices').value=v.some(x=>x.name===prev)?prev:'';if(!v.length)$('acStatus').textContent='No installed English voice detected yet. Replay may require device voice settings.'}
$('acMusic').checked=a.state.music;$('acEffects').checked=a.state.sfx;$('acVoice').checked=a.state.voice;$('acVolume').value=Math.round(a.state.volume*100);
$('acMusic').onchange=()=>{a.unlock();a.setMusic($('acMusic').checked);if(a.state.music)a.startMusic();else a.stopMusic();mirror()};
$('acEffects').onchange=()=>{a.setSfx($('acEffects').checked);if(a.state.sfx)a.effect('click');mirror()};
$('acVoice').onchange=()=>{a.setVoice($('acVoice').checked);mirror();$('acStatus').textContent=$('acVoice').checked?'Narration enabled. Tap Hear Game Master Z to preview.':'Narration off.'};
$('acVolume').oninput=()=>a.setVolume(Number($('acVolume').value)/100);
$('acVoices').onchange=()=>{a.voiceName($('acVoices').value);a.stopVoice()};
$('acSample').onclick=()=>{a.unlock();a.effect('ready');const ok=a.speak("Hey, brainiacs! Welcome to Mind Clash Z! I am your Game Master! Ready to battle those brains?",true);$('acStatus').textContent=ok?'Playing a voice sample. If silent, select another voice or check your device settings.':'Narration is off or unavailable. Turn it on to test.'};
drawVoices();if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',drawVoices);mirror();
})();