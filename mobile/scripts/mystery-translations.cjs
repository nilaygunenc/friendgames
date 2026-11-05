const fs=require('fs'),ts=require('../node_modules/typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1}}).outputText,p);
const game=require('../src/data/games.ts').gamesData.find(g=>g.id==='gizemli-hikaye');
const en=JSON.parse(fs.readFileSync('src/i18n/en.json','utf8'));
const values=[
[game.name,'Mystery Story (Yes / No)'],
['Yeni','New'],['Mantık','Logic'],
[game.description,'Solve the truth behind a mysterious event together using only yes/no questions. One moderator, many detectives!'],
...game.rules.map((r,i)=>[r,[
'Choose a moderator. The moderator first reads the opening and secret solution alone.',
'The moderator hides the solution and shares only the story opening with the group.',
'Players ask yes/no questions. The moderator answers “Yes”, “No”, or optionally “Irrelevant”.',
'Discuss ideas freely. Use logical deductions from the answers instead of random guesses.',
'The moderator must keep the solution unchanged, answer consistently, and avoid direct hints or leading players.',
'When the group identifies the cause, sequence and outcome, the moderator confirms and reveals the full solution. You win together!'
][i]])
];
for(const [tr,value] of values)en[tr]=value;
fs.writeFileSync('src/i18n/en.json',JSON.stringify(en,null,2));
