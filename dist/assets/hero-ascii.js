(() => {
const pre=document.querySelector('#hero-ascii'),host=document.querySelector('#outside-scene');if(!pre||!host)return;
window.asciiMode=false;document.body.dataset.art='3d';const mode=document.querySelector('#art-mode');mode?.addEventListener?.('click',()=>{window.asciiMode=!window.asciiMode;document.body.dataset.art=window.asciiMode?'ascii':'3d';mode.textContent=window.asciiMode?'3D view':'ASCII view';mode.setAttribute('aria-pressed',String(window.asciiMode));});
const sample=document.createElement('canvas'),ctx=sample.getContext('2d',{willReadFrequently:true});let last=0,animationClock=0;const chars=' .,:;=+*#%@';const colors=['#789f82','#b0d2a0','#f4d695','#fff0ce','#e49b71'];
function escape(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
window.paintAsciiScene=canvas=>{
 const now=performance.now();if(now-last<90)return;last=now;if(window.portfolioMotionPlaying)animationClock=now;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;
 const cols=r.width<500?76:100,rows=Math.round(cols*(r.height/r.width)*.53);sample.width=cols;sample.height=rows;
 try{ctx.clearRect(0,0,cols,rows);ctx.drawImage(canvas,0,0,cols,rows);const pixels=ctx.getImageData(0,0,cols,rows).data;let html='';for(let y=0;y<rows;y++){let run='',prev=-1;for(let x=0;x<cols;x++){const at=(y*cols+x)*4,a=pixels[at+3]/255;const rr=pixels[at],gg=pixels[at+1],bb=pixels[at+2],b=(rr*.3+gg*.59+bb*.11)/255;let c=a<.08?' ':chars[Math.max(1,Math.min(chars.length-1,Math.floor(b*(chars.length-1))))];const birdX=Math.floor((animationClock*.007+y*13)%(cols+12))-6;if(a<.08&&(y===5||y===9)&&x>=birdX&&x<birdX+5)c=(Math.floor(animationClock/350)%2?'_/v\\':'\\_v_/')[x-birdX]||' ';let tone=a<.08?0:rr>gg*1.2?4:b>.82?3:rr>gg*.95?2:b>.5?1:0;if(tone!==prev){if(run)html+='<span style="color:'+colors[prev]+'">'+escape(run)+'</span>';run='';prev=tone;}run+=c;}if(run)html+='<span style="color:'+colors[prev]+'">'+escape(run)+'</span>';html+='\n';}pre.innerHTML='<span>'+html+'</span>';pre.style.fontSize=(r.width/(cols*.605))+'px';pre.style.lineHeight=(r.height/rows)+'px';host.classList.add('ascii-ready');}catch(e){host.dataset.asciiFallback='true';}
};
})();
// A full text animation remains available if the 3D renderer cannot start.
(() => {
const host=document.querySelector('#outside-scene'),pre=document.querySelector('#hero-ascii');if(!host||!pre)return;let t=0;
const hut=[
'              .----.              ',
'              | __ |              ',
'          ____|_||_|____          ',
'         /::::::::::::::\\         ',
'        /::/::::::::::\\::\\        ',
'       /::/::::::::::::\\::\\       ',
'      /__/______________\\__\\      ',
'       | .---.    .---. |         ',
'       | | + |    | + | |         ',
'       | \'---\' __ \'---\' |         ',
'       |      /  \\     |         ',
'       |      | o|     |         ',
'       |______|__|_____|         ',
'           /______\\              ',
'      .......\\..\\........       ',
'    ....:::::::::::::::....       ',
'   ...:::::::::::::::::::...      ',
'     \'...................\'        '
];
let timer=setInterval(()=>{if(host.classList.contains('ascii-ready')||document.hidden||document.body.dataset.view!=='outside')return;if(window.portfolioMotionPlaying)t++;const cols=68,rows=44,g=Array.from({length:rows},()=>Array(cols).fill(' '));function put(x,y,s){if(y<0||y>=rows)return;for(let i=0;i<s.length;i++)if(x+i>=0&&x+i<cols)g[y][x+i]=s[i];}
for(let i=0;i<14;i++){const x=(i*19+7)%cols,y=(i*7+3)%24;put(x,y,(t+i)%5===0?'+':'.');}
put((t+4)%56,5,t%2?'_v_':'\\v/');put((t+32)%56,9,t%2?'\\v/':'_v_');
for(let i=0;i<3;i++)put(4+i*23,22-i%2*3,'   /\\   ');for(let i=0;i<3;i++){put(4+i*23,23-i%2*3,'  /++\\  ');put(4+i*23,24-i%2*3,' /++++\\ ');put(4+i*23,25-i%2*3,'   ||   ');}
hut.forEach((line,i)=>put(17,15+i,line));put(34+Math.round(Math.sin(t)),12,t%2?'( )':' ~ ');put(35,10,t%2?' . ':'( )');for(let i=0;i<3;i++)put(9+i*18,36,' ,,, /\\ ,,, ');
pre.textContent=g.map(row=>row.join('')).join('\n');const r=host.getBoundingClientRect();pre.style.fontSize=(r.width/(cols*.605))+'px';pre.style.lineHeight=(r.height/rows)+'px';host.classList.add('ascii-fallback-ready');},240);
window.addEventListener('pagehide',()=>clearInterval(timer));
})();
