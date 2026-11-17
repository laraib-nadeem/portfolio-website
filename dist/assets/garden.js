import * as THREE from './vendor/three.module.js';
const host=document.querySelector('#outside-scene'),canvas=document.querySelector('#outside-canvas'),button=document.querySelector('#enter-door');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'default'});}catch(error){canvas.hidden=true;canvas.setAttribute('aria-hidden','true');}
if(renderer)start();
function start(){
renderer.setPixelRatio(Math.min(devicePixelRatio||1,3));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,60);camera.position.set(4.0,3.25,7.5);const look=new THREE.Vector3(0,1.15,0);camera.lookAt(look);
scene.add(new THREE.HemisphereLight(0xfff3d7,0x668254,1.85));const sun=new THREE.DirectionalLight(0xffe2ae,3.1);sun.position.set(-3,7,5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun);const fill=new THREE.DirectionalLight(0xc0d8c7,1.15);fill.position.set(4,3,-4);scene.add(fill);
const world=new THREE.Group();scene.add(world);world.rotation.y=-.15;
const mats={};const mat=(color,extra={})=>{const key=color+JSON.stringify(extra);return mats[key]||(mats[key]=new THREE.MeshStandardMaterial({color,roughness:.88,...extra}));};
function mesh(geo,color,parent=world){const m=new THREE.Mesh(geo,typeof color==='string'?mat(color):color);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ball(x,y,z,sx,sy,sz,color,parent=world){const m=mesh(new THREE.SphereGeometry(1,20,14),color,parent);m.position.set(x,y,z);m.scale.set(sx,sy,sz);return m;}
function box(w,h,d,r,color,parent=world){r=Math.min(r,w/2-.001,h/2-.001);const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const geo=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:6});geo.translate(0,0,-d/2);return mesh(geo,color,parent);}
function rod(a,b,r,color,parent=world){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const m=mesh(new THREE.CylinderGeometry(r,r*.98,delta.length(),12),color,parent);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;}
// Moss island and a softly rounded plaster cottage.
ball(0,-.04,0,2.7,.23,1.95,'#82996c');ball(0,-.19,0,2.59,.19,1.85,'#5a7650');
const house=new THREE.Group();house.position.set(-.45,0,-.35);world.add(house);
// A soft, slightly tapered mushroom stem, with a genuine gap for the door.
const stem=mesh(new THREE.CylinderGeometry(1.01,1.16,1.75,64,1,true,.36,Math.PI*2-.72),'#f3e0b6',house);stem.position.y=1.08;stem.name='rounded-cottage-stem';
const doorHeader=mesh(new THREE.CylinderGeometry(1.01,1.055,.51,24,1,true,-.36,.72),'#f3e0b6',house);doorHeader.position.y=1.7;
const floor=mesh(new THREE.CylinderGeometry(1.14,1.14,.1,64),'#cbb18a',house);floor.position.y=.23;
const hallLight=new THREE.PointLight(0xffd497,1.2,3);hallLight.position.set(0,1,0);house.add(hallLight);
// Outward-facing, smooth hemisphere: no hollow cap or exposed rectangular top.
const mushroomCap=mesh(new THREE.SphereGeometry(1,64,32,0,Math.PI*2,0,Math.PI/2),'#b53a35',house);mushroomCap.scale.set(1.75,1.12,1.51);mushroomCap.position.y=1.9;mushroomCap.name='closed-mushroom-roof';
const underside=mesh(new THREE.CylinderGeometry(1.71,1.65,.11,64),'#e6d0aa',house);underside.position.y=1.89;underside.scale.z=.86;
const softRim=mesh(new THREE.TorusGeometry(1.67,.075,10,64),'#a5312d',house);softRim.rotation.x=Math.PI/2;softRim.scale.y=.86;softRim.position.y=1.92;
for(const [r,angle,size]of [[.0,0,.19],[.56,.4,.18],[.72,2.6,.22],[1.12,1.35,.19],[1.15,3.5,.23],[1.28,5.1,.2],[1.48,.1,.16],[1.47,2.15,.16],[.65,4.55,.17]]){const x=Math.cos(angle)*r,z=Math.sin(angle)*r*(1.51/1.75),y=1.9+1.12*Math.sqrt(1-(r/1.75)**2);const spot=ball(x,y+.009,z,size,.018,size*.92,'#fff0d3',house);spot.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(x/(1.75**2),(y-1.9)/(1.12**2),z/(1.51**2)).normalize());}
const hinge=new THREE.Group();hinge.position.set(-.325,.84,1.085);house.add(hinge);
const door=box(.65,1.17,.11,.3,'#96704c',hinge);door.position.set(.325,0,0);
for(let i=0;i<4;i++)rod([.095+i*.145,-.49,.07],[.095+i*.145,.34,.07],.012,'#7b5c40',hinge);
ball(.51,0,.095,.035,.035,.03,'#e6c27c',hinge);
const arch=mesh(new THREE.TorusGeometry(.365,.047,8,36,Math.PI),'#c7a77c',house);arch.position.set(0,1.1,1.105);
for(const x of [-.365,.365])rod([x,.26,1.105],[x,1.1,1.105],.047,'#c7a77c',house);
const windowMat=mat('#f5ce86',{emissive:'#f1aa4c',emissiveIntensity:.35});const windows=[];
for(const side of [-1,1]){const windowGroup=new THREE.Group();windowGroup.position.set(side*.83,1.19,.71);windowGroup.rotation.y=side*.78;house.add(windowGroup);const frame=box(.47,.58,.11,.2,'#bda176',windowGroup);const pane=box(.35,.46,.025,.16,windowMat,windowGroup);pane.position.z=.07;windows.push(pane);rod([0,-.2,.1],[0,.2,.1],.021,'#e6cca0',windowGroup);rod([-.15,0,.1],[.15,0,.1],.021,'#e6cca0',windowGroup);const sill=box(.55,.07,.22,.025,'#c2a77d',windowGroup);sill.position.set(0,-.32,.055);}
for(let i=0;i<3;i++){const stone=box(.9+i*.12,.14,.34,.1,['#c4bea1','#cfc7aa','#d6cfb5'][i]);stone.position.set(-.45,.22-i*.06,.92+i*.32);stone.rotation.y=.08;}
// Porch cat: cream clay body, round cheeks, tiny paws and sleepy eyes.
const cat=new THREE.Group();world.add(cat);cat.position.set(.72,.28,1.05);cat.rotation.y=-.08;
ball(0,.08,0,.6,.1,.38,'#d1b38b',cat);ball(0,.22,0,.45,.23,.28,'#f3e3c6',cat);ball(.15,.38,.14,.28,.26,.24,'#f6e8ce',cat);
for(const x of [.0,.31]){const ear=mesh(new THREE.ConeGeometry(.115,.24,3),'#b89470',cat);ear.position.set(x,.62,.12);ear.rotation.z=x<.1?-.2:.2;ball(x,.61,.155,.052,.065,.022,'#d8b4a1',cat);}
for(const x of [.055,.245]){const eye=rod([x-.035,.41,.362],[x+.035,.4,.362],.009,'#4d4435',cat);}
ball(.15,.34,.378,.025,.018,.014,'#b08077',cat);ball(-.22,.14,.22,.13,.08,.1,'#f6e8ce',cat);ball(.01,.14,.27,.12,.08,.1,'#f6e8ce',cat);const tail=mesh(new THREE.TorusGeometry(.23,.075,10,24,Math.PI*1.65),'#b89470',cat);tail.rotation.x=Math.PI/2;tail.position.set(-.28,.2,-.04);
// Small sage figures with sculpted heads, knees, arms and a shy wave.
const figures=[];function figure(x,z,scale,pose){const g=new THREE.Group();world.add(g);g.position.set(x,.25,z);g.scale.setScalar(scale);ball(0,.32,0,.15,.24,.12,'#bacb94',g);ball(0,.65,.01,.21,.22,.2,'#c8d7a3',g);for(const x of [-.075,.075])ball(x,.68,.192,.018,.023,.012,'#46553b',g);for(const x of [-.13,.13]){ball(x,.14,.15,.1,.12,.1,'#b5c58e',g);rod([x,.26,.13],[x,.11,.26],.065,'#bacb94',g);}const arm=new THREE.Group();arm.position.set(.14,.46,0);g.add(arm);rod([0,0,0],[.16,.14,.03],.055,'#c0d09a',arm);ball(.16,.15,.03,.06,.065,.055,'#c8d7a3',arm);rod([-.14,.44,.02],[-.18,.2,.2],.055,'#c0d09a',g);figures.push({group:g,arm,pose});return g;}
figure(-1.8,.9,.8,'wave');
// A pond and small flowers make foreground depth visible as the view turns.
ball(1.75,.16,.9,.62,.055,.43,mat('#a6c4b6',{roughness:.25,metalness:.1}));for(let i=0;i<11;i++){const a=i/11*Math.PI*2;ball(1.75+Math.cos(a)*.65,.18,.9+Math.sin(a)*.43,.12,.09,.1,['#b6ba9a','#ccd0ad'][i%2]);}
for(const [x,z,s] of [[-2.2,-.5,.8],[1.9,-1.1,.7],[-1.9,1.5,.55],[2.15,.3,.5]]){rod([x,.15,z],[x,.4*s+.15,z],.045,'#e9dbc0');const mushroom=ball(x,.4*s+.15,z,.23*s,.12*s,.22*s,'#a78568');for(let k=0;k<3;k++)ball(x+Math.cos(k*2.1)*.12*s,.48*s+.15,z+Math.sin(k*2.1)*.1*s,.035,.02,.035,'#f1dfba');}
for(let i=0;i<17;i++){const a=i*2.4,x=Math.cos(a)*(2.1+(i%3)*.2),z=Math.sin(a)*1.65;ball(x,.15,z,.18,.11,.16,i%2?'#94a77a':'#a3b384');if(i%3===0){rod([x,.2,z],[x,.5,z],.018,'#72865a');for(let j=0;j<5;j++){const a=j/5*6.28;ball(x+Math.cos(a)*.065,.53,z+Math.sin(a)*.065,.055,.04,.055,'#eee0ab');}ball(x,.55,z,.035,.03,.035,'#bfa772');}}
const smokes=[];
let visible=true,last=0,frame,entering=false,drag=null,dragged=false,target=0,entryAnimation=null,entryResolve=null;
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),doorPoint=new THREE.Vector3();
function paused(){return !window.portfolioMotionPlaying;}
function render(){camera.lookAt(look);scene.updateMatrixWorld(true);house.localToWorld(doorPoint.set(0,.95,1.14));doorPoint.project(camera);if(!entering){button.style.left=((doorPoint.x+1)/2*100)+'%';button.style.top=((-doorPoint.y+1)/2*100)+'%';}renderer.render(scene,camera);if(window.asciiMode)window.paintAsciiScene?.(canvas);}
// Fit the actual mesh bounds through a complete turn, rather than an oversized sphere.
scene.updateMatrixWorld(true);
const fitCenter=new THREE.Vector3(0,1.15,0),fitPoints=[];
world.traverse(o=>{if(!o.isMesh)return;o.geometry.computeBoundingBox();const box=o.geometry.boundingBox;for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])fitPoints.push(new THREE.Vector3(x,y,z).applyMatrix4(o.matrixWorld));});
function size(){
 const r={width:host.clientWidth||host.getBoundingClientRect().width,height:host.clientHeight||host.getBoundingClientRect().height};if(!r.width||!r.height)return;
 renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;
 if(!entering){
  camera.fov=38;const vertical=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),horizontal=vertical*camera.aspect;
  const direction=new THREE.Vector3(4,2.1,7.5).normalize();
  camera.position.copy(direction.clone().add(fitCenter));camera.lookAt(fitCenter);
  const inverse=camera.quaternion.clone().invert(),point=new THREE.Vector3();let distance=0;
  for(let turn=0;turn<32;turn++)for(const original of fitPoints){
   point.copy(original).applyAxisAngle(THREE.Object3D.DEFAULT_UP,turn*Math.PI/16).sub(fitCenter).applyQuaternion(inverse);
   distance=Math.max(distance,point.z+Math.abs(point.x)*1.10/horizontal,point.z+Math.abs(point.y)*1.10/vertical);
  }
  camera.position.copy(direction.multiplyScalar(distance).add(fitCenter));look.copy(fitCenter);
 }
 camera.updateProjectionMatrix();render();
}
function tick(t){frame=requestAnimationFrame(tick);if(!visible||document.hidden||t-last<33)return;const dt=last?Math.min((t-last)/1000,.1):0;last=t;if(!paused()&&!entering){if(!drag){world.rotation.y+=dt*.035;target=world.rotation.y;}cat.scale.y=1+Math.sin(t*.0017)*.045;for(const [i,p] of smokes.entries()){p.position.y=3.38+((t*.0001+i*.25)%.8);p.position.x=-1.1+Math.sin(t*.0009+i)*.07;}for(const f of figures)f.arm.rotation.z=Math.sin(t*.002)*.12;}render();}
window.cottageReset=()=>{entryAnimation?.kill();entryResolve?.();entryResolve=null;entering=false;target=0;world.rotation.y=0;hinge.rotation.y=0;camera.position.set(4.0,3.25,7.5);look.set(0,1.15,0);window.gsap?.set(host,{opacity:1});window.gsap?.set('.outside-image',{clearProps:'transform,opacity'});size();};
window.cottageEnter=()=>new Promise(resolve=>{if(entering){resolve();return;}entering=true;entryResolve=resolve;if(!window.gsap||paused()){resolve();return;}const g=window.gsap;entryAnimation=g.timeline({onUpdate:render,onComplete:()=>{entryResolve=null;resolve();}})
.to(world.rotation,{y:0,duration:.7,ease:'power2.inOut'},0)
.to(hinge.rotation,{y:-1.45,duration:.65,ease:'power2.inOut'},.05)
.to(look,{x:-.45,y:1.0,z:.73,duration:1.1,ease:'power2.inOut'},0)
.to(camera.position,{x:-.45,y:1.22,z:3.15,duration:1.15,ease:'power2.inOut'},0)
.to(camera.position,{x:-.45,y:1.08,z:1.35,duration:.75,ease:'power2.in'},1.05)
.to(host,{opacity:0,duration:.4,ease:'power1.in'},1.4);
});
canvas.addEventListener('pointerdown',e=>{if(e.button!==0||entering)return;drag={x:e.clientX,y:e.clientY,start:target};dragged=false;});
canvas.addEventListener('pointermove',e=>{if(!drag||entering)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){dragged=true;target=THREE.MathUtils.clamp(drag.start+dx*.005,-Infinity,Infinity);world.rotation.y=target;render();}});
for(const event of ['pointerup','pointercancel','pointerleave'])canvas.addEventListener(event,()=>drag=null);
canvas.addEventListener('click',e=>{if(dragged||entering)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);if(ray.intersectObjects(hinge.children,true).length)window.portfolioEnter?.();});
canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.portfolioEnter?.();}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();target=THREE.MathUtils.clamp(target+(e.key==='ArrowLeft'?-.15:.15),-Infinity,Infinity);world.rotation.y=target;render();}});
new ResizeObserver(size).observe(host);new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(host);new MutationObserver(()=>{if(!host.hidden)size();}).observe(document.body,{attributes:true,attributeFilter:['data-view']});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);host.classList.remove('is-ready');canvas.hidden=true;window.cottageEnter=undefined;button.style.left='43%';button.style.top='59%';});
window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(tick);});
size();host.classList.add('is-ready');frame=requestAnimationFrame(tick);
}
