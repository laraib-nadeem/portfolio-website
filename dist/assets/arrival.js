(() => {
'use strict';
const root=document.documentElement,rig=document.querySelector('#hanging-name'),sign=document.querySelector('#name-pendant'),delivery=document.querySelector('#bird-delivery'),bird=document.querySelector('#intro-bird'),tether=document.querySelector('#bird-tether');
if(!rig||!sign||!delivery||!bird||!tether){root.classList.add('arrival-safe');return;}
const chains=[rig.querySelector('.chain-left'),rig.querySelector('.chain-right')],pose={y:0,angle:0},reduced=matchMedia('(prefers-reduced-motion: reduce)');let timeline=null,started=false;
function drawChains(){const w=rig.clientWidth||rig.getBoundingClientRect().width,h=sign.offsetHeight||sign.getBoundingClientRect().height;const rad=pose.angle*Math.PI/180,anchorY=-18;[.27,.73].forEach((ratio,i)=>{const localX=(ratio-.5)*w,localY=h*.13,x=w*.5+localX*Math.cos(rad)-localY*Math.sin(rad),y=pose.y+localX*Math.sin(rad)+localY*Math.cos(rad),dx=x-ratio*w,dy=y-anchorY;const length=y<anchorY?0:Math.hypot(dx,dy);chains[i].style.left=(ratio*w)+'px';chains[i].style.height=length+'px';chains[i].style.transform='translateX(-50%) rotate('+(-Math.atan2(dx,Math.max(1,dy))*180/Math.PI)+'deg)';});}
function drawSign(){window.gsap?.set(sign,{y:pose.y,rotation:pose.angle,transformOrigin:'50% 0%'});drawChains();}
function finalState(){pose.y=0;pose.angle=0;root.classList.add('arrival-safe','arrival-started','arrival-static','arrival-name','arrival-label','arrival-house','arrival-flowers');if(window.gsap){gsap.set(sign,{y:0,rotation:0});gsap.set(delivery,{x:0,y:0,rotation:0,opacity:1});gsap.set([bird,tether],{opacity:0});gsap.set('#outside-scene',{opacity:1,scale:1});gsap.set('.dot-flower-field,.entry-footer',{opacity:1});}sign.style.visibility='visible';delivery.style.visibility='visible';bird.classList.remove('is-flying');drawChains();}
function start(){if(started)return;started=true;if(!window.gsap||reduced.matches||window.portfolioMotionPlaying===false){finalState();return;}
const g=window.gsap;root.classList.add('arrival-started');root.classList.remove('arrival-static');g.set(sign,{visibility:'visible'});g.set(delivery,{visibility:'visible'});g.set([bird,tether],{opacity:1});bird.classList.add('is-flying');pose.y=-(window.innerHeight+(sign.offsetHeight||250)+100);pose.angle=-7;drawSign();
timeline=g.timeline({delay:.15,onComplete:()=>{root.classList.add('arrival-safe');bird.classList.remove('is-flying');}})
.call(()=>root.classList.add('arrival-name'),[],0)
.to(pose,{y:16,angle:5,duration:.55,ease:'power2.in',onUpdate:drawSign},0)
.to(pose,{y:-8,angle:-4,duration:.18,ease:'power2.out',onUpdate:drawSign},.55)
.to(pose,{y:3,angle:2,duration:.16,ease:'sine.inOut',onUpdate:drawSign},.73)
.to(pose,{y:0,angle:0,duration:.21,ease:'sine.out',onUpdate:drawSign},.89)
.call(()=>root.classList.add('arrival-label'),[],1.15)
.fromTo(delivery,{x:-(window.innerWidth+450),y:30,rotation:-9},{x:18,y:-9,rotation:3,duration:.75,ease:'power2.out'},1.15)
.to(delivery,{x:0,y:0,rotation:0,duration:.2,ease:'sine.inOut'},1.9)
.to(tether,{opacity:0,duration:.18},2.07)
.to(bird,{x:window.innerWidth*.8+220,y:-115,rotation:-12,opacity:0,duration:.4,ease:'power2.in'},2.1)
.call(()=>root.classList.add('arrival-house'),[],2.55)
.fromTo('#outside-scene',{opacity:0,scale:.65},{opacity:1,scale:1,duration:.5,ease:'back.out(1.5)'},2.55)
.fromTo('.entry-footer',{opacity:0},{opacity:1,duration:.5},2.8)
.call(()=>root.classList.add('arrival-flowers'),[],2.95)
.fromTo('.dot-flower-field',{opacity:0},{opacity:1,duration:.65,ease:'sine.out'},2.95);
}
const image=sign.querySelector('img');if(image&&!image.complete){image.addEventListener('load',start,{once:true});image.addEventListener('error',()=>{started=true;finalState();},{once:true});}else start();
new ResizeObserver(drawChains).observe(rig);
new MutationObserver(()=>{if(window.portfolioMotionPlaying===false&&timeline){timeline.progress(1).pause();finalState();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
reduced.addEventListener('change',e=>{if(e.matches){timeline?.progress(1).pause();finalState();}});
window.addEventListener('pageshow',drawChains);window.addEventListener('pagehide',()=>timeline?.pause());
})();
