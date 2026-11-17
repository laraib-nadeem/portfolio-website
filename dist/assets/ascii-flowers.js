(() => {
 'use strict';
 const field=document.querySelector('.dot-flower-field');if(!field)return;
 const ns='http://www.w3.org/2000/svg';
 function flower(){
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 200 200');
  const dot=(x,y)=>{const c=document.createElementNS(ns,'circle');c.setAttribute('cx',x.toFixed(2));c.setAttribute('cy',y.toFixed(2));c.setAttribute('r','1.7');c.setAttribute('fill','currentColor');svg.appendChild(c);};
  // Dot-matrix five-point bloom with the curled center from the reference.
  const curve=[];
  for(let i=0;i<=2400;i++){
   const a=i*Math.PI*2/2400,r=67+17*Math.cos(5*(a+Math.PI/2)) + 4*Math.sin(3*a);
   curve.push({x:100+r*Math.cos(a),y:100+r*Math.sin(a)});
  }
  for(let i=0;i<=1000;i++){
   const a=i/1000*Math.PI*3.8,r=2+i/1000*37;
   curve.push({x:100+r*Math.cos(a),y:100+r*Math.sin(a)});
  }
  // Braille-like little dot pairs retain the reference's text-art texture.
  const cells=new Set();
  for(const p of curve){const x=Math.round(p.x/4)*4,y=Math.round(p.y/4)*4;cells.add(x+','+y);}
  for(const cell of cells){const [x,y]=cell.split(',').map(Number);dot(x,y);}
  return svg;
 }
 // A small, regular all-over pattern; staggered rows avoid large bare patches.
 for(let row=0;row<9;row++)for(let col=0;col<4;col++){
  const el=document.createElement('div');el.className='dot-bloom';
  const styles={x:(col*29+(row%2?14:-1))+'%',y:(row*12+2)+'%',size:'82px','mobile-size':'82px',color:['#f0bfcf','#f4dea1','#cfc0e9','#bde0cf'][(row+col)%4],speed:(36+(row+col)%4*4)+'s',delay:-(row*11+col*7)+'s'};
  for(const [k,v] of Object.entries(styles))el.style.setProperty('--'+k,v);
  el.appendChild(flower());field.appendChild(el);
 }
})();
