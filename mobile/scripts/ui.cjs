const fs = require('fs');
const length = 2205, wav = Buffer.alloc(44 + length * 2);
wav.write('RIFF'); wav.writeUInt32LE(wav.length-8,4); wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(22050,24);wav.writeUInt32LE(44100,28);
wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(length*2,40);
for(let i=0;i<length;i++)wav.writeInt16LE(Math.round(Math.sin(i/22050*880*Math.PI*2)*2500*(1-i/length)**2),44+i*2);
fs.writeFileSync('assets/tap.wav',wav);
const dirs=['screens','components','navigation'];
const names=['Text','View','ScrollView','FlatList','TouchableOpacity','TextInput'];
for(const dir of dirs)for(const file of fs.readdirSync('src/'+dir).filter(f=>f.endsWith('.tsx'))){
 const p='src/'+dir+'/'+file;
 let s=fs.readFileSync(p,'utf8');
 const used=[];
 s=s.replace(/import\s*{([^}]+)}\s*from 'react-native';/g,(all,list)=>{
 const keep=list.split(',').map(x=>x.trim()).filter(Boolean).filter(x=>{if(names.includes(x)){used.push(x);return false}return true});
 return keep.length?"import { "+keep.join(', ')+" } from 'react-native';":'';
 });
 if(used.length)s="import { "+used.join(', ')+" } from '../ui';\n"+s;
 fs.writeFileSync(p,s);
}
