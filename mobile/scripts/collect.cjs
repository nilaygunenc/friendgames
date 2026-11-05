const fs=require('fs'),ts=require('../node_modules/typescript');
const paths=['screens','components','navigation','data','utils'].flatMap(d=>fs.readdirSync('src/'+d).filter(f=>/tsx?$/.test(f)).map(f=>'src/'+d+'/'+f));
const set=new Set();
for(const path of paths){const file=ts.createSourceFile(path,fs.readFileSync(path,'utf8'),99,true);function visit(n){if(ts.isStringLiteral(n)||ts.isJsxText(n)){const s=(ts.isJsxText(n)?n.getText(file):n.text).trim();if(/[çğıöşüÇĞİÖŞÜ]|\s/.test(s)&&!s.startsWith('rgba')&&!s.startsWith('http')&&!s.startsWith('../')&&!s.startsWith('@'))set.add(s);}ts.forEachChild(n,visit)}visit(file)}
fs.writeFileSync('scripts/strings.json',JSON.stringify([...set],null,2));
