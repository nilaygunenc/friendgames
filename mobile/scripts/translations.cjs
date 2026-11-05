const fs=require('fs'), ts=require('../node_modules/typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1}}).outputText,p);
const dictionary=Object.fromEntries(fs.readFileSync('src/i18n/en.txt','utf8').split(/\r?\n/).filter(l=>l.includes('|')).map(l=>l.split('|')));
const q=require('../src/data/questions.ts');
const pools=[
['buzKiriciSorular',[
'What did you want to be when you were a child?','Where would you be if you were not here right now?',
'What makes you laugh the most?','What decision have you never regretted?','What superpower would you choose?',
'What was the highlight of your week?','What would you like to learn from scratch?',
'Would you rather always arrive very early or always arrive late?','What was your longest journey like?',
'Could you spend a week without your phone?','Who knows you best?','If you could restart your life, which period would you revisit?',
'What is the strangest food combination?','Which movie character would you like to be?',
'Did someone make you happy today?','Which habit are you happiest with?','What do you put off most in life?',
'Do you know your neighbors?','When did you last chat with a stranger?','The seaside or the mountains?'
]],
['sinirSorular',[
'Who did you last lie to?','Is there a secret you have never shared?','Who in this group do you argue with most?',
'Who should you have apologized to but never did?','What was your most embarrassing moment?',
'Have you ever talked behind someone’s back?','What last made you really cry?','Love, money, or health?',
'Have you delayed something for too long? What was it?','Is there something you have never told someone in this group?',
'What is your biggest regret?','Who are you most angry with right now?'
]],
['kimDahaCok',[
'Who wakes up last?','Who uses the most emojis?','Who takes the longest to choose food?',
'Who makes the most excuses for being late?','Who spends the most time online?','Who reacts most dramatically?',
'Who eats the most?','Who retells their favorite memory most often?','Who loves selfies the most?',
'Who makes the group laugh most?','Who sleeps the most?','Who loves spending money most?'
]],
['sirinCani',[
'Be woken at 5 a.m. or stay awake all night?','Read everyone’s thoughts or have everyone read yours?',
'Speak by singing or walk by dancing for a year?','Lose your best friend or lose ten years of memories?',
'Never be able to lie or never know the truth?','Always feel too hot or always feel too cold?'
]]];
for(const [key,en] of pools){if(q[key].length!==en.length)throw Error(key);q[key].forEach((s,i)=>dictionary[s]=en[i]);}
const cards=require('../src/data/tabu.ts').tabuKartlar;
const enCards=[
['APPLE','Fruit','Tree','Red','Eat','Garden'],['SEA','Water','Beach','Wave','Fish','Swim'],
['AIRPLANE','Pilot','Air','Wing','Journey','Airport'],['MUSIC','Note','Song','Sound','Instrument','Concert'],
['PHOTO','Camera','Take','Picture','Lens','Album'],['SPORT','Ball','Game','Competition','Training','Football'],
['BOOK','Read','Page','Story','Author','Cover'],['STREET','Road','Avenue','Walk','Pavement','Traffic'],
['SUN','Light','Hot','Yellow','Space','System'],['FRIEND','Pal','Person','Together','Group','Beside'],
['WEDDING','Marriage','Bride','Groom','Vows','Ceremony'],['MONEY','Cash','Coin','Currency','Banknote','Salary'],
['HOLIDAY','Sea','Travel','Hotel','Summer','Rest'],['PHONE','Mobile','Caller','Screen','Smart','App'],
['PIZZA','Italy','Dough','Tomato','Cheese','Oven'],['DOG','Animal','Paw','Bark','Leash','Fur'],
['CAR','Steering wheel','Engine','Wheel','Driving','Passenger'],['HOSPITAL','Doctor','Medicine','Patient','Surgery','Nurse'],
['SCHOOL','Teacher','Classroom','Lesson','Student','Exam'],['CINEMA','Movie','Screen','Watch','Ticket','Curtain']];
cards.forEach((c,i)=>[c.main,...c.banned].forEach((s,j)=>dictionary[s]=enCards[i][j]));
dictionary['Bu sürümde hesap açmadan oynayabilirsiniz. Favoriler, dil, tema, grup büyüklüğü ve tercihler cihazınızda saklanır. Rol dağıtımı ve kart çekimi cihazda yapılır. Uygulama bu oyun verilerini bir sunucuya göndermez. VIP yalnızca oturumluk demodur ve ödeme alınmaz. Uygulama verilerini cihaz ayarlarından silebilirsiniz. Geliştirme önizlemesi Expo araçlarını kullanır. İsteğe bağlı sunucu bağlantısı veya gerçek ödeme eklendiğinde bu metin güncellenecektir.']='You can play without an account. Favorites, language, theme, group size and preferences are stored on your device. Roles and cards are generated locally. The app does not send this gameplay data to a server. VIP is a session-only demo and no payment is taken. You can erase app data in your device settings. The development preview uses Expo tools. This notice will be updated when optional server connections or real payments are added.';
dictionary['FriendGames\nSürüm 1.0.0\n\nArkadaşlarınla tek telefon üzerinden parti oyunları oyna. Oyunları keşfet, favorilerini kaydet ve telefonu sırayla paylaş.\n\nBu sürüm geliştirme aşamasındadır. VIP bir demodur; gerçek abonelik veya ödeme içermez.']='FriendGames\nVersion 1.0.0\n\nPlay party games with your friends on one phone. Discover games, save your favorites and take turns sharing the phone.\n\nThis version is in development. VIP is a demo with no real subscriptions or payments.';
fs.writeFileSync('src/i18n/en.json',JSON.stringify(dictionary,null,2));
