const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const OUT = path.join(__dirname, '..', 'assets');
let W = 720, H = 420;

const palettes = {
  animals: ['#18232b', '#425451', '#d19a68', '#e3c49c', '#8caaa2'],
  mythic: ['#171f2b', '#4b5567', '#d5b184', '#b87452', '#8f9eac'],
  beauty: ['#30242d', '#78606b', '#d8b3a0', '#ead8c6', '#9e7f84'],
  food: ['#302923', '#6f5341', '#d89a57', '#f0d6a8', '#779076'],
  characters: ['#1b2029', '#3a424d', '#c89f7a', '#ead8c6', '#8596a0'],
  survival: ['#202825', '#49584e', '#ba8f67', '#d5c7a6', '#8b9a89'],
  worklife: ['#202831', '#45565b', '#d5a876', '#e2d1b9', '#8ea5a5'],
  kurtlar: ['#111920', '#263744', '#9d765d', '#d6c0a4', '#80919a'],
  ask: ['#30242c', '#5a414a', '#c79379', '#e7d2bd', '#9b7476'],
  selena: ['#1c2034', '#484569', '#c6a5ce', '#e8d8cf', '#8d9fbd'],
  ezel: ['#171c27', '#3d4550', '#bc9874', '#e0cfbb', '#7e8b9a'],
  behzat: ['#1a2225', '#384347', '#b9906b', '#dcc9af', '#89999a'],
  avrupa: ['#25252c', '#4b4a50', '#d1a579', '#e6d7c5', '#94a2a2'],
  muhtesem: ['#292126', '#55423b', '#c9a25d', '#ecd5a0', '#9f7867'],
  cukur: ['#201f20', '#474443', '#a85546', '#e0c7b0', '#8b8176'],
  leyla: ['#1b2830', '#3d5960', '#d19c6f', '#e7d2ac', '#9db0a4'],
};

function rgba(hex, alpha = 255) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), alpha];
}

function surface(palette) {
  const data = Buffer.alloc(W * H * 4);
  const a = rgba(palette[0]), b = rgba(palette[1]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = Math.min(1, (x * 0.7 / W + y * 0.3 / H));
    const i = (y * W + x) * 4;
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(a[c] * (1 - t) + b[c] * t);
    data[i + 3] = 255;
  }
  return data;
}

function pixel(g, x, y, color) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  g.data[i] = color[0]; g.data[i + 1] = color[1]; g.data[i + 2] = color[2]; g.data[i + 3] = color[3];
}
function rect(g, x, y, w, h, color) {
  const c = Array.isArray(color) ? color : rgba(color);
  for (let py = Math.floor(y); py < Math.ceil(y + h); py++) for (let px = Math.floor(x); px < Math.ceil(x + w); px++) pixel(g, px, py, c);
}
function ellipse(g, cx, cy, rx, ry, color, inner = 0) {
  const c = Array.isArray(color) ? color : rgba(color);
  for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    if (d <= 1 && d >= inner * inner) pixel(g, x, y, c);
  }
}
function line(g, x1, y1, x2, y2, width, color) {
  const c = Array.isArray(color) ? color : rgba(color);
  const steps = Math.ceil(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)));
  for (let i = 0; i <= steps; i++) {
    const t = steps ? i / steps : 0, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t;
    ellipse(g, x, y, width / 2, width / 2, c);
  }
}
function polygon(g, pts, color) {
  const c = Array.isArray(color) ? color : rgba(color);
  const ys = pts.map(p => p[1]), xs = pts.map(p => p[0]);
  const minY = Math.floor(Math.min(...ys)), maxY = Math.ceil(Math.max(...ys));
  const minX = Math.floor(Math.min(...xs)), maxX = Math.ceil(Math.max(...xs));
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) pixel(g, x, y, c);
  }
}
function roundRect(g, x, y, w, h, r, color) {
  rect(g, x + r, y, w - 2 * r, h, color); rect(g, x, y + r, w, h - 2 * r, color);
  ellipse(g, x + r, y + r, r, r, color); ellipse(g, x + w - r, y + r, r, r, color);
  ellipse(g, x + r, y + h - r, r, r, color); ellipse(g, x + w - r, y + h - r, r, r, color);
}
function circleFrame(g, p, cx, cy, r) {
  ellipse(g, cx, cy, r, r, p[2]); ellipse(g, cx, cy, r - 10, r - 10, p[0]);
  ellipse(g, cx, cy, r - 20, r - 20, p[1]); ellipse(g, cx, cy, r - 28, r - 28, p[0]);
}

function drawAnimals(g, p, species = 'fox') {
  polygon(g, [[0,270],[145,160],[248,260],[365,125],[520,260],[620,156],[720,256],[720,420],[0,420]], '#58685f');
  polygon(g, [[0,325],[160,225],[310,330],[480,220],[650,320],[720,285],[720,420],[0,420]], '#263a3b');
  ellipse(g, 500, 92, 38, 38, '#d9c7a9');
  if (species === 'eagle') { polygon(g, [[155,205],[350,130],[565,202],[390,187],[520,300],[360,230],[200,315],[310,204]], p[3]); ellipse(g, 365, 197, 34, 21, p[2]); }
  else if (species === 'dolphin') { ellipse(g, 360, 237, 165, 61, p[2]); polygon(g, [[250,230],[320,167],[390,205],[430,154],[454,225],[557,232],[442,267],[362,287]], p[3]); ellipse(g, 401, 220, 7, 7, p[0]); }
  else if (species === 'tiger') { ellipse(g, 360, 234, 112, 70, '#c18b61'); ellipse(g, 440, 194, 62, 55, '#d19a68'); polygon(g, [[399,151],[406,111],[433,145]], p[2]); polygon(g, [[459,145],[485,115],[482,160]], p[2]); for (let x=303;x<438;x+=34) line(g,x,190,x-25,245,11,p[0]); }
  else if (species === 'octopus') { ellipse(g, 360, 218, 73, 63, '#ad796f'); for (let i=0;i<8;i++){const a=Math.PI*2*i/8;line(g,360+Math.cos(a)*48,235+Math.sin(a)*36,360+Math.cos(a)*145,310+Math.sin(a)*75,16,'#ad796f');} ellipse(g,340,211,7,7,p[0]); ellipse(g,379,211,7,7,p[0]); }
  else if (species === 'elephant') { ellipse(g, 348, 235, 120, 85, '#8caaa2'); ellipse(g, 450, 211, 67, 67, '#9bb6ae'); ellipse(g, 489, 198, 20, 20, p[3]); polygon(g, [[493,226],[533,228],[518,303],[494,304]], '#8caaa2'); ellipse(g, 482,198,6,6,p[0]); line(g,300,292,298,350,29,'#8caaa2'); line(g,383,292,383,350,29,'#8caaa2'); }
  else { ellipse(g, 344, 242, 126, 67, p[2]); ellipse(g, 450, 208, 67, 58, p[2]); polygon(g, [[417,163],[423,120],[449,156]], p[2]); polygon(g, [[463,156],[493,124],[485,170]], p[2]); polygon(g, [[493,208],[560,222],[495,238]], p[2]); ellipse(g,463,204,7,7,p[0]); line(g,300,286,296,345,20,p[2]); line(g,382,286,385,345,20,p[2]); }
}
function drawMythic(g, p, type = 'dragon') {
  circleFrame(g,p,360,210,174); ellipse(g,360,210,117,117,p[4],.82);
  if(type==='phoenix'){polygon(g,[[360,287],[285,234],[198,175],[293,190],[228,114],[325,166],[360,105],[395,166],[492,114],[427,190],[522,175],[435,234]],p[2]);line(g,360,280,360,332,13,p[3]);}
  else if(type==='kraken'){ellipse(g,360,206,59,51,p[2]);for(let i=0;i<8;i++){let a=i*Math.PI/4;line(g,360,228,360+Math.cos(a)*135,215+Math.sin(a)*109,17,p[2]);}ellipse(g,340,197,7,7,p[0]);ellipse(g,380,197,7,7,p[0]);}
  else if(type==='mermaid'){ellipse(g,357,175,51,51,p[3]);polygon(g,[[338,210],[378,210],[396,284],[360,316],[324,284]],p[2]);polygon(g,[[360,294],[304,343],[358,329],[416,343]],p[2]);line(g,314,180,245,244,16,p[4]);}
  else if(type==='griffin'){ellipse(g,350,236,96,62,p[2]);ellipse(g,427,181,54,47,p[3]);polygon(g,[[304,214],[230,118],[334,176],[385,122],[377,214]],p[4]);polygon(g,[[466,183],[529,202],[468,216]],p[2]);}
  else if(type==='centaur'){ellipse(g,349,267,103,51,p[2]);ellipse(g,407,170,44,52,p[3]);polygon(g,[[380,211],[430,221],[412,270],[365,252]],p[3]);line(g,305,290,285,338,13,p[2]);line(g,383,290,398,340,13,p[2]);}
  else {polygon(g,[[250,266],[282,207],[249,154],[312,176],[360,118],[404,176],[471,156],[444,214],[500,261],[428,248],[400,305],[360,267],[322,306],[295,252]],p[2]);polygon(g,[[360,242],[404,204],[438,231],[408,261]],p[4]);ellipse(g,380,211,6,6,p[0]);}
}
function drawBeauty(g,p,kind='compact'){
  ellipse(g,360,340,240,36,'#15191f');
  if(kind==='airwrap'){roundRect(g,315,112,84,205,34,'#d5b9ac');line(g,355,157,355,286,28,p[3]);ellipse(g,355,112,73,47,p[4]);ellipse(g,355,112,52,31,p[1]);line(g,355,289,355,332,17,p[3]);}
  else if(kind==='lipstick'||kind==='gloss'){roundRect(g,312,177,98,148,22,p[2]);roundRect(g,329,107,63,95,15,p[3]);roundRect(g,321,154,80,33,8,p[4]);line(g,360,85,360,133,22,p[2]);}
  else if(kind==='cream'){roundRect(g,276,181,170,133,30,p[3]);roundRect(g,293,151,136,42,13,p[2]);ellipse(g,360,149,66,12,p[4]);}
  else if(kind==='perfume'){roundRect(g,302,166,116,148,20,p[2]);roundRect(g,327,132,66,40,8,p[3]);roundRect(g,345,109,30,27,5,p[4]);ellipse(g,360,235,38,38,p[4],.82);}
  else if(kind==='filter'){roundRect(g,294,150,132,174,35,p[3]);roundRect(g,314,111,93,54,18,p[2]);ellipse(g,360,220,43,43,p[4],.82);}
  else {ellipse(g,360,230,115,115,p[3]);ellipse(g,360,230,95,95,p[2]);ellipse(g,360,230,73,73,p[4]);ellipse(g,360,230,50,50,p[1]);ellipse(g,360,230,28,28,p[3]);}
}
function drawFood(g,p,kind='plate'){
  ellipse(g,360,222,215,169,'#1a1d1d');ellipse(g,360,212,191,151,p[2]);ellipse(g,360,206,164,126,p[3]);ellipse(g,360,206,150,112,'#eadfc8');
  if(kind==='drink'){roundRect(g,300,112,120,170,22,p[4]);ellipse(g,360,112,60,17,p[3]);line(g,360,81,360,113,12,p[3]);ellipse(g,360,281,54,10,p[2]);}
  else if(kind==='ayran'){roundRect(g,315,120,90,179,13,'#eee9dc');roundRect(g,327,138,66,143,7,'#d7e1df');line(g,367,103,354,159,9,p[4]);}
  else if(kind==='dessert'){for(let x=288;x<430;x+=34){ellipse(g,x,205,33,69,p[3]);line(g,x-15,173,x+8,235,9,p[2]);}ellipse(g,360,205,14,15,p[4]);}
  else if(kind==='manti'){for(let x=301;x<423;x+=36)for(let y=173;y<251;y+=39){polygon(g,[[x,y-15],[x+16,y],[x,y+15],[x-16,y]],'#c99a72');ellipse(g,x,y,6,6,'#f3e2ce');}}
  else if(kind==='mussels'){for(let i=0;i<7;i++){ellipse(g,290+i*23,209+(i%2)*30,29,19,'#454d44');line(g,290+i*23,209+(i%2)*30,305+i*23,208+(i%2)*30,5,p[3]);}}
  else {for(let i=0;i<7;i++){const x=292+(i%4)*39, y=170+Math.floor(i/4)*48;ellipse(g,x,y,24,15,p[2]);line(g,x-16,y-2,x+15,y+2,5,p[4]);}}
  for(let i=0;i<6;i++){const x=260+i*37;ellipse(g,x,312+(i%2)*10,6,12,p[4]);}
}
function drawCharacters(g,p,series){
  // Editorial poster collage for the selected Turkish drama, built locally so it never depends on a remote host.
  roundRect(g,48,38,624,344,22,'#11171d');
  const tiles = [[74,64,177,116],[271,64,177,116],[468,64,177,116],[74,196,177,116],[271,196,177,116],[468,196,177,116]];
  tiles.forEach(([x,y,w,h],i)=>{roundRect(g,x,y,w,h,10,i%2?p[1]:p[0]);ellipse(g,x+w*.52,y+h*.42,32,38,i%2?p[3]:p[2]);roundRect(g,x+w*.26,y+h*.7,w*.48,29,13,i%2?p[2]:p[4]);});
  roundRect(g,150,335,420,4,2,p[3]);
  if(series==='kurtlar'){for(let x=75;x<650;x+=73){rect(g,x,95+(x%3)*9,44,84,p[0]);rect(g,x+10,116,6,9,p[4]);rect(g,x+27,137,6,8,p[2]);}ellipse(g,570,80,36,36,p[2]);}
  else if(series==='selena'){ellipse(g,580,90,42,42,p[3]);ellipse(g,597,77,41,41,p[1]);for(let x=90;x<630;x+=83)line(g,x,70,x+15,91,3,p[4]);}
  else if(series==='muhtesem'){polygon(g,[[250,183],[250,105],[360,56],[470,105],[470,183]],p[4]);for(let x=278;x<455;x+=40)line(g,x,116,x,181,7,p[2]);}
  else if(series==='cukur'){ellipse(g,360,210,54,54,p[2],.80);line(g,105,177,610,177,5,p[2]);}
  else if(series==='behzat'){for(let x=100;x<630;x+=78)line(g,x,54,x-50,185,3,'#829091');roundRect(g,553,235,40,56,10,p[4]);}
  else if(series==='avrupa'){roundRect(g,537,84,62,98,9,p[4]);line(g,568,93,568,165,6,p[2]);}
  else if(series==='ask'){ellipse(g,570,96,27,27,p[2]);line(g,104,132,148,157,3,p[3]);}
  else if(series==='ezel'){ellipse(g,579,83,32,32,p[4]);ellipse(g,579,83,15,15,p[0]);}
  else if(series==='leyla'){ellipse(g,573,84,37,37,p[2]);line(g,533,281,618,281,9,p[4]);line(g,548,281,540,311,6,p[4]);line(g,605,281,614,311,6,p[4]);}
}
function drawSurvival(g,p,kind='camp'){
  polygon(g,[[0,298],[159,230],[280,300],[451,219],[720,296],[720,420],[0,420]],'#202a27');
  if(kind==='vehicle'){roundRect(g,174,193,380,111,25,p[2]);polygon(g,[[250,193],[308,137],[444,137],[500,193]],p[4]);ellipse(g,256,307,46,46,p[0]);ellipse(g,486,307,46,46,p[0]);ellipse(g,256,307,20,20,p[3]);ellipse(g,486,307,20,20,p[3]);}
  else if(kind==='medical'){roundRect(g,250,126,220,184,32,'#ddd7c8');roundRect(g,326,151,68,132,11,p[2]);roundRect(g,295,183,130,68,11,p[2]);roundRect(g,318,102,84,29,10,p[3]);}
  else if(kind==='food'){roundRect(g,301,131,118,186,19,'#899582');roundRect(g,293,125,134,25,9,p[3]);ellipse(g,360,220,36,43,p[2]);line(g,360,175,360,261,7,p[3]);}
  else {polygon(g,[[176,313],[252,150],[362,92],[470,150],[546,313]],p[2]);polygon(g,[[252,313],[362,92],[470,313]],p[4]);line(g,360,97,360,318,7,p[3]);line(g,252,158,470,158,6,p[3]);}
}
function drawWork(g,p,kind='desk'){
  rect(g,0,290,720,130,'#202427');line(g,89,285,637,285,20,p[2]);line(g,177,298,161,390,17,p[4]);line(g,547,298,565,390,17,p[4]);
  if(kind==='coffee'){ellipse(g,349,227,62,55,p[3]);ellipse(g,349,217,49,39,p[4]);ellipse(g,349,217,39,28,p[2]);ellipse(g,350,217,27,16,'#473c34');line(g,402,211,429,220,10,p[3]);}
  else if(kind==='headphones'){roundRect(g,281,160,158,128,28,'#313b41');ellipse(g,360,154,101,92,p[4],.72);roundRect(g,270,211,45,76,17,p[2]);roundRect(g,405,211,45,76,17,p[2]);}
  else if(kind==='notes'){roundRect(g,243,135,233,151,14,'#e3d7c1');for(let y=166;y<263;y+=25)line(g,273,y,438,y,4,p[2]);line(g,305,145,305,277,3,p[4]);}
  else {polygon(g,[[199,224],[516,224],[458,153],[257,153]],'#bec8c4');rect(g,211,223,292,15,p[4]);polygon(g,[[203,242],[513,242],[548,281],[177,281]],'#667779');for(let x=229;x<482;x+=26)line(g,x,253,x+9,268,4,'#d5d1c5');}
  roundRect(g,116,87,488,11,5,p[4]);
}

const categoryDrawers = {
  animals: (g,p)=>drawAnimals(g,p), mythic: (g,p)=>drawMythic(g,p), beauty: (g,p)=>drawBeauty(g,p), food: (g,p)=>drawFood(g,p),
  characters: (g,p)=>drawCharacters(g,p,'collage'), survival:(g,p)=>drawSurvival(g,p), worklife:(g,p)=>drawWork(g,p),
};
const seriesDrawers = {
  'kurtlar-vadisi':['kurtlar',(g,p)=>drawCharacters(g,p,'kurtlar')],
  'ask-memnu':['ask',(g,p)=>drawCharacters(g,p,'ask')],
  selena:['selena',(g,p)=>drawCharacters(g,p,'selena')],
  ezel:['ezel',(g,p)=>drawCharacters(g,p,'ezel')],
  'behzat-c':['behzat',(g,p)=>drawCharacters(g,p,'behzat')],
  'avrupa-yakasi':['avrupa',(g,p)=>drawCharacters(g,p,'avrupa')],
  'muhtesem-yuzyil':['muhtesem',(g,p)=>drawCharacters(g,p,'muhtesem')],
  cukur:['cukur',(g,p)=>drawCharacters(g,p,'cukur')],
  'leyla-mecnun':['leyla',(g,p)=>drawCharacters(g,p,'leyla')],
};

function crc32(buf) {
  let c = ~0;
  for (const b of buf) { c ^= b; for (let k=0;k<8;k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return (~c) >>> 0;
}
function chunk(name, body) {
  const n = Buffer.from(name), out = Buffer.alloc(12 + body.length);
  out.writeUInt32BE(body.length,0); n.copy(out,4); body.copy(out,8); out.writeUInt32BE(crc32(Buffer.concat([n,body])),8+body.length);
  return out;
}
function writePng(file,g,w=W,h=H) {
  const raw = Buffer.alloc((w*4+1)*h);
  for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;g.data.copy(raw,y*(w*4+1)+1,y*w*4,(y+1)*w*4);}
  const head=Buffer.alloc(13);head.writeUInt32BE(w,0);head.writeUInt32BE(h,4);head[8]=8;head[9]=6;
  const bytes=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',zlib.deflateSync(raw,{level:7})),chunk('IEND',Buffer.alloc(0))]);
  fs.writeFileSync(file,bytes);
}
function create(file,palette,draw){const g={data:surface(palette)};draw(g,palette);writePng(file,g);}
fs.mkdirSync(OUT,{recursive:true});
for(const [key,draw] of Object.entries(categoryDrawers))create(path.join(OUT,`auction-${key}.png`),palettes[key],draw);
for(const [key,[palette,draw]] of Object.entries(seriesDrawers))create(path.join(OUT,`auction-series-${key}.png`),palettes[palette],draw);

// Missing app.json launch assets were preventing clean Expo/native builds.
function drawAppIcon(size) {
  W = H = size;
  const scale = size / 256, s = v => Math.round(v * scale);
  const palette=['#222d35','#394c55','#d8b27b','#efe1cb','#a7bbc0'];
  const g={data:Buffer.alloc(W*H*4)};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const inside=(x-size/2)**2+(y-size/2)**2<(size*.45)**2;
    pixel(g,x,y,inside?rgba(palette[1]):[0,0,0,0]);
  }
  roundRect(g,s(48),s(91),s(160),s(94),s(32),palette[3]);
  roundRect(g,s(69),s(111),s(78),s(49),s(17),palette[1]);
  ellipse(g,s(89),s(134),s(10),s(10),palette[3]);ellipse(g,s(89),s(134),s(4),s(4),palette[1]);
  line(g,s(116),s(122),s(116),s(145),s(6),palette[3]);line(g,s(105),s(133),s(128),s(133),s(6),palette[3]);
  ellipse(g,s(172),s(120),s(8),s(8),palette[2]);ellipse(g,s(190),s(139),s(8),s(8),palette[4]);ellipse(g,s(170),s(157),s(8),s(8),'#bd8571');
  return g;
}
const appIcon=drawAppIcon(1024);
writePng(path.join(OUT,'icon.png'),appIcon,1024,1024);
writePng(path.join(OUT,'adaptive-icon.png'),appIcon,1024,1024);
writePng(path.join(OUT,'favicon.png'),drawAppIcon(256),256,256);

W=720;H=1560;
const splash={data:surface(['#171f27','#26353d'])};
const left=(W-256)/2, top=(H-256)/2;
for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const src=((y*4)*1024+x*4)*4, dst=((top+y)*W+left+x)*4;
  appIcon.data.copy(splash.data,dst,src,src+4);
}
writePng(path.join(OUT,'splash.png'),splash,W,H);
console.log(`Generated ${Object.keys(categoryDrawers).length + Object.keys(seriesDrawers).length} local auction illustrations and 4 Expo assets.`);
