/* Mind Clash Z showmaster, accessible voice controls and question art */
(()=>{
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const robot=`<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Game Master Z, a smiling neon arcade robot"><defs><linearGradient id="mzFace" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#27dfff"/><stop offset="1" stop-color="#a65dff"/></linearGradient><filter id="mzGlow"><feGaussianBlur stdDeviation="2"/></filter></defs><ellipse cx="91" cy="159" rx="55" ry="12" fill="#00e8ff" opacity=".17"/><path d="M41 147 Q46 110 91 112 Q139 109 142 148 L126 164 L54 164Z" fill="#2f2567" stroke="#a96bff" stroke-width="5"/><path d="M79 122 L103 122 L94 152Z" fill="#ffe064"/><path d="M67 123 L106 123 L91 142Z" fill="#1bd8eb"/><rect x="41" y="36" width="102" height="94" rx="31" fill="#172447" stroke="url(#mzFace)" stroke-width="6"/><rect x="53" y="54" width="80" height="64" rx="22" fill="#071327"/><ellipse cx="75" cy="78" rx="8" ry="12" fill="#78f6ff"/><ellipse cx="111" cy="78" rx="8" ry="12" fill="#78f6ff"/><path d="M77 100 Q91 115 108 99" fill="none" stroke="#ff92e6" stroke-width="6" stroke-linecap="round"/><path d="M37 67 Q37 34 88 28 Q141 28 147 67" fill="none" stroke="#ff63cf" stroke-width="9" stroke-linecap="round"/><rect x="26" y="65" width="19" height="37" rx="8" fill="#8653e8" stroke="#65ecff" stroke-width="3"/><rect x="140" y="65" width="19" height="37" rx="8" fill="#8653e8" stroke="#65ecff" stroke-width="3"/><path d="M90 28 L90 11" stroke="#70fcda" stroke-width="4"/><circle cx="90" cy="9" r="6" fill="#ffe168"/><path d="M104 130 Q137 113 158 126" fill="none" stroke="#ffb4ed" stroke-width="8" stroke-linecap="round"/><circle cx="159" cy="128" r="10" fill="#fdd2ba"/><path d="M165 118 L168 108" stroke="#fdd2ba" stroke-width="6" stroke-linecap="round"/></svg>`;
function figure(){return '<div class="master-avatar">'+robot+'</div>'}
function explain(q){const v=q.opts[q.correct],t=q.trivia||'';const n=q.q.toLowerCase();
const special={
'What is Woo Young-woo’s profession?':'Woo Young-woo is a lawyer at Hanbada; her work on legal cases is the entire premise of Extraordinary Attorney Woo.',
'Who played Do Jung-woo in Awaken (2020)?':'Namkoong Min is the actor who portrays police investigator Do Jung-woo in the 2020 series Awaken.',
'Who directed Titanic (1997)?':'James Cameron directed Titanic and oversaw its large-scale recreation of the ship’s final voyage.',
'What is the fictional African country in Black Panther?':'Wakanda is the fictional African nation in Black Panther; its extraordinary technology is powered by the fictional metal vibranium.',
'Which film won the first Academy Award for Best Animated Feature?':'Shrek won the first Best Animated Feature Oscar at the 74th Academy Awards in 2002, for films released in 2001.',
'What is the fictional setting of George Orwell’s Animal Farm?':'Orwell’s story is set on an English farm, where the farm animals overthrow their owner; the setting supports the political allegory.',
'What is the main protein network formed in wheat dough through kneading?':'Gluten is the elastic network made from wheat proteins, chiefly glutenin and gliadin. Kneading helps develop it, making dough stretchy.',
'What is the maximum number of distinct rotations of a square Tetris O-piece by appearance?':'A square O-piece has rotational symmetry, so turning it 90, 180 or 270 degrees does not change how it looks.',
'What is the relative minor of C major?':'A minor shares C major’s key signature: neither has sharps or flats. Both use the same seven notes but have different tonal centers.',
'Which composer wrote The Rite of Spring?':'Igor Stravinsky composed The Rite of Spring, a ballet premiered in Paris in 1913 whose rhythms and harmonies shocked audiences.',
'How many players are on the court for one basketball team?':'In standard five-on-five basketball, each team fields exactly five players on court at a time; substitutes wait on the bench.',
'Which country hosted the first modern Olympics in 1896?':'The first modern Olympic Games took place in Athens, Greece, in 1896 as a revival inspired by ancient Greek competitions.',
'Which group recorded Dancing Queen?':'ABBA, the Swedish pop group, released Dancing Queen in 1976. It became one of their signature hits.',
'Who is the cowboy toy in Toy Story?':'Woody is Andy’s pull-string cowboy doll in Toy Story. Buzz Lightyear, by contrast, is the space-ranger toy.',
'What is the currency of Japan?':'The yen is Japan’s official currency, introduced during the nineteenth-century monetary reforms; won and yuan belong elsewhere.',
'Which novel begins with “Call me Ishmael”?':'“Call me Ishmael” opens Herman Melville’s Moby-Dick and introduces the narrator of Captain Ahab’s whaling voyage.',
'What is the capital of New Zealand?':'Wellington is the capital at the southern tip of New Zealand’s North Island; Auckland is larger but is not the capital.',
'What does ROI stand for?':'ROI means Return on Investment, comparing gains or losses with the cost of the investment to evaluate its performance.',
'What does a current ratio compare?':'The current ratio divides current assets by current liabilities. It measures resources available to cover near-term obligations.',
'In project management, what is the critical path?':'The critical path is the longest sequence of dependent project tasks; delaying it delays the project finish if no float remains.',
'What is the purpose of a cryptographic hash function?':'A cryptographic hash converts an input into a fixed-size digest. Good cryptographic designs make reversing it or finding matching collisions computationally difficult.',
'Who painted the Mona Lisa?':'Leonardo da Vinci painted the Mona Lisa using subtle shading and careful observation; it is now displayed at the Louvre.',
'Who first walked on the Moon?':'Neil Armstrong stepped onto the lunar surface during Apollo 11 in July 1969; Buzz Aldrin followed him.',
'Which planet is famous for its prominent rings?':'Saturn is famous for its bright rings of ice and rocky debris. Other giant planets have rings too, but theirs are less conspicuous.',
'Which 2017 animated film was made entirely from hand-painted oil paintings?':'Loving Vincent uses thousands of individual oil-painted frames modeled on van Gogh’s art, creating a fully painted animated feature.'
};
if(special[q.q])return special[q.q];
if(n.startsWith('why ')||n.startsWith('how do ')||n.startsWith('what mainly causes')||n.includes('process')||n.includes('purpose'))return t;
if(n.includes('which treaty')||n.includes('which law')||n.includes('which court')||n.includes('what is the name'))return v+' is the relevant answer. '+t;
if(n.includes('who ')||n.includes('which artist')||n.includes('which composer')||n.includes('which writer'))return v+' is credited for this. '+t;
if(n.includes('where ')||n.includes('which country')||n.includes('which continent')||n.includes('which strait'))return v+' is the location. '+t;
return v+' is correct here. '+t;
}
const roasts={
Sports:['Your answer just airballed from the logo. Even the scoreboard went “huh?”','That pick took a timeout and never returned. Replay the facts!','The referee checked VAR. The correct answer is still laughing.'],
'K-Drama':['That guess was the villain reveal nobody saw coming... because it was not in the script.','Plot twist: your answer was a cameo. The right one was the actual lead.','The drama is dramatic, but that guess got written out in episode one.'],
Science:['The lab has reviewed your hypothesis and gently escorted it outside.','The scientific method said: “Interesting theory. Let’s not publish it yet.”','That answer had good chemistry... with a completely different question.'],
History:['That guess arrived from an alternate timeline wearing sunglasses.','History class just requested a rewrite of that episode.','The archives said “bestie, check the century.”'],
Geography:['That answer took the scenic route and ended up in a different country.','Your GPS says “recalculating.” Very aggressively.','That pick just crossed three borders without a passport.'],
Food:['That answer was seasoned with confidence and zero correct ingredients.','The recipe was almost cooking... until the facts tasted it.','The Michelin inspector has requested one more taste test.'],
Technology:['Error 404: correct choice not found in that click.','That guess is running on yesterday’s software update.','Try clearing the cache of that assumption.'],
Gaming:['That answer pressed the wrong combo. Respawn with new intel!','Critical miss! We love a dramatic boss fight.','Wrong cheat code, but the next level is loading.']
};
const generic=['The confidence was premium; the accuracy was still in beta.','That guess was giving main-character energy in the wrong movie.','Your brain served a plot twist, not the answer.','That was a bold audition, but the facts cast someone else.'];
function feedback(q,choice,remaining,totalSeconds){if(choice===q.correct){const t=(remaining??0)/(totalSeconds||20);return t>=.70?'⚡ LIGHTNING GENIUS! Your neurons filed that answer in express shipping.':t>=.35?'👑 BIG BRAIN ENERGY! That was a clean win.':'🎯 CLUTCH LEGEND! The buzzer blinked first.'}if(choice===null||choice===undefined||choice===-1)return '⏰ The buzzer stole the scene! Plot twist: your comeback is next round.';const a=roasts[q.cat]||generic;const seed=String(q.id).length+(q.id||0);return '😏 '+a[seed%a.length]+' The answer was '+q.opts[q.correct]+'.'}
const draw={Sports:'🏀',Science:'🧪',Space:'🪐',History:'🏛️',Philippines:'🇵🇭','K-Drama':'🎬',Geography:'🌍',Food:'🍜',Gaming:'🎮',Art:'🎨',Music:'🎵',Animals:'🐾',Nature:'🌿',World:'🌐',Movies:'🍿',Technology:'💻',Business:'💼',Literature:'📚',Mythology:'⚡',Computers:'🖥️',Language:'🔤'};
function art(q){let sport=q.cat==='Sports'&&/basketball|court|touchdown/i.test(q.q);if(sport)return `<svg viewBox="0 0 520 200" role="img" aria-label="Basketball illustration" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="court" x2="1" y2="1"><stop stop-color="#30235e"/><stop offset="1" stop-color="#0c4b67"/></linearGradient></defs><rect width="520" height="200" rx="16" fill="url(#court)"/><g fill="none" stroke="#b7dcff" stroke-opacity=".45" stroke-width="3"><rect x="17" y="17" width="486" height="166" rx="3"/><path d="M260 18V183"/><circle cx="260" cy="100" r="36"/><path d="M17 65h85v70H17m486-70h-85v70h85"/></g><circle cx="260" cy="92" r="42" fill="#f39335" stroke="#271c2b" stroke-width="4"/><path d="M218 92h84M260 50v84M230 62q60 30 0 60M290 62q-60 30 0 60" stroke="#492619" stroke-width="3" fill="none"/><path d="M390 51h78v7h-78" fill="#fff"/><path d="M425 58v14m-19 0h38l-7 27h-23z" fill="none" stroke="#ff88da" stroke-width="4"/></svg>`;
return '<div class="topic-picture" role="img" aria-label="'+esc(q.cat)+' illustration"><span>'+ (draw[q.cat]||'🧠') +'</span><strong>'+esc(q.cat.toUpperCase())+'</strong></div>'}
function speak(t,enabled=true){if(!enabled||!('speechSynthesis'in window))return false;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.94;u.pitch=1.03;u.volume=.94;speechSynthesis.speak(u);return true}catch{return false}}
function stopVoice(){if('speechSynthesis'in window)try{speechSynthesis.cancel()}catch{}}
window.MCZ={figure,explain,feedback,art,speak,stopVoice};
})();