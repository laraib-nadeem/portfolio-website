import * as THREE from './vendor/three.module.js';
const host=document.querySelector('#room-frame'),canvas=document.querySelector('#room-canvas');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'default'});}catch(error){canvas.hidden=true;}
if(renderer)buildRoom();
function buildRoom(){
renderer.setPixelRatio(Math.min(devicePixelRatio||1,3));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-4,4,4,-4,.1,70);camera.position.set(6,5.5,9);camera.lookAt(0,1.3,0);
scene.add(new THREE.HemisphereLight(0xfff3d7,0x46654a,2.2));const light=new THREE.DirectionalLight(0xffdfac,3.5);light.position.set(-3,8,7);light.castShadow=true;light.shadow.mapSize.set(1024,1024);Object.assign(light.shadow.camera,{left:-5,right:5,top:6,bottom:-5});light.shadow.normalBias=.025;scene.add(light);const fill=new THREE.DirectionalLight(0xb6d3c2,1.3);fill.position.set(5,4,-3);scene.add(fill);
const room=new THREE.Group();scene.add(room);const pickables=[],materials={};
const material=(color,extra={})=>{const key=color+JSON.stringify({...extra,map:extra.map?.uuid});return materials[key]||(materials[key]=new THREE.MeshStandardMaterial({color,roughness:.85,...extra}));};
function m(geometry,color,parent=room){const mesh=new THREE.Mesh(geometry,typeof color==='string'?material(color):color);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function box(w,h,d,r,color,parent=room){r=Math.min(r,w/2-.001,h/2-.001);const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,curveSegments:5,steps:1});g.translate(0,0,-d/2);return m(g,color,parent);}
function cube(x,y,z,w,h,d,r,color,parent=room){const o=box(w,h,d,r,color,parent);o.position.set(x,y,z);return o;}
function ball(x,y,z,sx,sy,sz,color,parent=room){const o=m(new THREE.SphereGeometry(1,20,14),color,parent);o.position.set(x,y,z);o.scale.set(sx,sy,sz);return o;}
function rod(a,b,r,color,parent=room){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from),o=m(new THREE.CylinderGeometry(r,r,delta.length(),12),color,parent);o.position.copy(from.add(to).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return o;}
function group(x,y,z,route){const g=new THREE.Group();g.position.set(x,y,z);if(route){g.userData.route=route;pickables.push(g);}room.add(g);return g;}
function textTexture(lines,bg='#fff6de',ink='#243e30'){const c=document.createElement('canvas');c.width=512;c.height=640;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=ink;ctx.textBaseline='top';lines.forEach((line,i)=>{ctx.font=i===0?'bold 36px Georgia':'24px Arial';ctx.fillText(line,42,50+i*65);});ctx.strokeStyle='#869778';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(42,280+i*39);ctx.lineTo(470,280+i*39);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
const loader=new THREE.TextureLoader();function photo(src,w,h,parent,whiteKey=false){const tex=loader.load(src,()=>render());tex.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.08,side:THREE.DoubleSide});if(whiteKey)mat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat paperWhite=min(diffuseColor.r,min(diffuseColor.g,diffuseColor.b));diffuseColor.a*=1.0-smoothstep(0.95,0.99,paperWhite);');};const p=m(new THREE.PlaneGeometry(w,h),mat,parent);p.castShadow=false;return p;}
// Actual room geometry: a cutaway dollhouse, thick floor, two walls and timber trim.
cube(0,-.02,0,6.1,.28,4.35,.12,'#986e4e');cube(0,.12,0,5.9,.12,4.16,.08,'#c39b73');for(let i=0;i<11;i++)cube(-2.65+i*.53,.192,0,.5,.025,4.08,.01,i%3===0?'#d1b18a':'#c7a17a');
cube(0,1.88,-2.05,6,3.38,.17,.06,'#536f59');cube(-2.97,1.88,0,.16,3.38,4.15,.06,'#e4d8b9');for(const y of [.32,3.47]){cube(0,y,-1.91,6,.12,.15,.03,'#a27b54');cube(-2.86,y,0,.14,.12,4.1,.03,'#a27b54');}
// Round woven rug and a richly coloured upholstered chair.
ball(0,.22,.6,1.85,.035,1.15,'#8aa58b');const rugRing=m(new THREE.TorusGeometry(1,.035,8,70),'#d0c7a2');rugRing.rotation.x=-Math.PI/2;rugRing.scale.set(1.7,1,1);rugRing.position.set(0,.25,.6);
const chair=group(.2,.24,-.48);cube(0,.52,0,1.15,.3,1,.18,'#53715b',chair);cube(0,1.08,-.38,1.15,.98,.2,.35,'#4f715b',chair);for(const side of [-1,1]){cube(side*.56,.83,.03,.17,.36,.88,.08,'#5f8065',chair);rod([side*.4,.45,-.24],[side*.46,0,-.28],.055,'#9a7958',chair);rod([side*.4,.45,.3],[side*.46,0,.4],.055,'#9a7958',chair);}const pillow=cube(0,1.0,-.19,.65,.52,.19,.13,'#efe0b8',chair);pillow.rotation.z=.09;
// Laraib's seated clay-style miniature: brown layered hair, bangs and black blazer.
const avatar=group(.2,.94,-.43,'avatar');avatar.name='laraib-chibi';
const skin='#f7dfd2',hair='#68452e',jacket='#303532';
ball(0,.34,0,.29,.38,.21,jacket,avatar);ball(0,.68,.02,.10,.12,.10,skin,avatar);
for(const side of [-1,1]){ball(side*.13,-.02,.20,.12,.26,.13,jacket,avatar);ball(side*.13,-.22,.29,.13,.07,.19,'#242b27',avatar);const lapel=cube(side*.105,.5,.195,.13,.29,.035,.02,'#454b42',avatar);lapel.rotation.z=side*.27;}
const head=new THREE.Group();head.name='avatar-head';head.position.y=1.04;avatar.add(head);
ball(0,.03,-.06,.49,.53,.39,hair,head);ball(0,-.012,.085,.43,.43,.35,skin,head);
for(const side of [-1,1]){
 ball(side*.38,-.12,.0,.14,.40,.24,hair,head);
 const curl=ball(side*.41,-.40,.04,.14,.18,.18,'#795137',head);curl.rotation.z=-side*.28;
 ball(side*.415,-.04,.08,.066,.105,.055,skin,head);ball(side*.43,-.14,.13,.024,.035,.019,'#dec381',head);
 const closedEyeCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(side*.15-.049,.012,.438),new THREE.Vector3(side*.15,.070,.444),new THREE.Vector3(side*.15+.049,.012,.438));const closedEye=m(new THREE.TubeGeometry(closedEyeCurve,16,.011,6,false),'#302c27',head);closedEye.name='avatar-closed-eye';
 ball(side*.245,-.12,.377,.069,.031,.012,'#e6b6af',head);
 const brow=rod([side*.115,.135,.399],[side*.19,.14,.384],.012,hair,head);
}
for(const [x,y,z,angle] of [[-.23,.32,.29,-.4],[-.08,.36,.34,-.25],[.08,.36,.34,.2],[.23,.31,.29,.4]]){const bang=ball(x,y,z,.145,.235,.115,'#795137',head);bang.rotation.z=angle;}
ball(0,-.075,.438,.022,.022,.015,skin,head);
// Round wire glasses and a tiny double-curve :3 mouth.
for(const side of [-1,1]){
 const rim=m(new THREE.TorusGeometry(.102,.013,8,40),'#574b3d',head);rim.name='avatar-glasses';rim.position.set(side*.15,.025,.445);
 rod([side*.245,.045,.425],[side*.37,.045,.27],.012,'#574b3d',head);
 ball(side*.246,-.13,.38,.075,.032,.014,'#e9b9b5',head);
}
rod([-.047,.04,.45],[.047,.04,.45],.012,'#574b3d',head);
for(const side of [-1,1]){
 const curve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(side*.082,-.17,.426),new THREE.Vector3(side*.05,-.255,.44),new THREE.Vector3(0,-.18,.442));
 const mouth=m(new THREE.TubeGeometry(curve,20,.013,8,false),'#895044',head);mouth.name='avatar-three-mouth';
}

const necklace=m(new THREE.TorusGeometry(.10,.009,6,28,Math.PI),'#d5b365',avatar);necklace.position.set(0,.57,.21);necklace.rotation.z=Math.PI;ball(0,.47,.22,.025,.027,.012,'#d5b365',avatar);
const waveArm=new THREE.Group();waveArm.position.set(.29,.55,.0);avatar.add(waveArm);waveArm.rotation.z=-.3;ball(.09,.10,0,.10,.22,.11,jacket,waveArm);ball(.13,.32,.01,.083,.09,.075,skin,waveArm);
ball(-.34,.39,.06,.10,.23,.11,jacket,avatar);ball(-.36,.20,.12,.075,.085,.07,skin,avatar);
let waveRemaining=0;window.waveLaraib=()=>{if(!window.portfolioMotionPlaying)return;waveRemaining=2.4;};
document.querySelector('#avatar-wave')?.addEventListener('click',()=>window.waveLaraib());
// A real raised desk, drawer, thick worktop, textile runner and résumé paper.
const desk=group(.2,0,.78,'resume');cube(0,1.25,0,3.5,.2,1.45,.3,'#ddbc8c',desk);for(const x of [-1.35,1.35])for(const z of [-.45,.45])rod([x,1.15,z],[x*1.04,.2,z*1.07],.085,'#ad8358',desk);cube(0,1.02,.2,2.6,.3,.7,.05,'#bf966a',desk);cube(0,1.0,.58,.9,.21,.07,.03,'#d1a877',desk);rod([-.12,1,.65],[.12,1,.65],.025,'#967443',desk);
const runner=cube(.05,1.365,.15,.65,.012,1.38,.01,'#7d9c7c',desk);const paperTex=textTexture(['Laraib Nadeem','Resume']);
// Window: dimensional frame, distant green trees, coral fabric curtains.
const windowG=group(1.45,2.12,-1.9,'education');cube(0,0,0,1.55,1.88,.12,.62,'#d6bd90',windowG);cube(0,0,.09,1.35,1.68,.03,.55,'#a9c6ad',windowG);ball(.28,.33,.12,.25,.25,.018,'#f4d58a',windowG);for(const [x,y,s]of [[-.43,-.4,.4],[.24,-.5,.48],[.55,-.6,.38]])ball(x,y,.13,s,s,.025,'#709c79',windowG);rod([0,-.78,.17],[0,.78,.17],.035,'#e5cda5',windowG);rod([-.63,0,.17],[.63,0,.17],.035,'#e5cda5',windowG);cube(0,-.92,.1,1.8,.1,.4,.03,'#d3b17f',windowG);for(const side of [-1,1])for(let i=0;i<3;i++){const c=cube(side*(.67+i*.065),-.03,.22,.15,1.88,.14,.06,i%2?'#ce9176':'#dfad8c',windowG);c.rotation.z=side*.04;}rod([-.97,1.02,.22],[.97,1.02,.22],.025,'#8f7352',windowG);
// Shelf, bright book spines, actual Sonny Angel photo without its white square.
const shelf=group(-1.73,1.25,-1.47,'projects');cube(0,0,0,1.9,.14,.7,.05,'#b88c5c',shelf);cube(-.7,-.22,-.12,.12,.38,.35,.03,'#a4794c',shelf);cube(.7,-.22,-.12,.12,.38,.35,.03,'#a4794c',shelf);for(let i=0;i<4;i++){const book=cube(-.68+i*.19,.37,.0,.16,.6+(i%2)*.14,.4,.025,['#728d64','#e2bd69','#b35e4c','#d9d0af'][i],shelf);book.rotation.z=i===1?-.12:0;}
// Small solid miniatures share the room's materials, shadows and warm lighting.
const headphoneBunny=group(-1.03,1.33,-1.37,'projects');headphoneBunny.name='headphones-bunny';headphoneBunny.rotation.y=.32;
const bunnyCream='#e9ddbd',bunnyRed='#ad5e4d',bunnyGreen='#587455';
ball(0,.29,0,.16,.22,.12,'#c2a976',headphoneBunny);ball(0,.62,0,.22,.21,.16,bunnyCream,headphoneBunny);
for(const side of [-1,1]){
 ball(side*.10,.89,0,.065,.22,.063,bunnyCream,headphoneBunny);
 ball(side*.09,.065,.025,.07,.065,.09,bunnyCream,headphoneBunny);
 ball(side*.21,.57,0,.065,.12,.09,bunnyRed,headphoneBunny);
 ball(side*.08,.62,.15,.013,.017,.009,'#34402f',headphoneBunny);
 const arm=ball(side*.17,.34,.02,.06,.13,.065,'#c2a976',headphoneBunny);arm.rotation.z=-side*.55;
 ball(side*.22,.40,.04,.05,.055,.045,bunnyCream,headphoneBunny);
}
const headband=m(new THREE.TorusGeometry(.215,.026,8,32,Math.PI),bunnyRed,headphoneBunny);headband.position.set(0,.64,-.04);
for(const side of [-1,1])rod([side*.027,.55,.163],[-side*.027,.515,.163],.009,'#34402f',headphoneBunny);
const scarf=meshScarf();
function meshScarf(){const collar=cube(0,.45,.015,.33,.075,.26,.035,bunnyGreen,headphoneBunny);const end=cube(.10,.32,.14,.09,.24,.035,.015,bunnyGreen,headphoneBunny);end.rotation.z=.12;for(const y of [.26,.32])cube(0,y,.123,.26,.022,.012,.004,bunnyRed,headphoneBunny);return collar;}
const laptopSmiski=group(1.35,1.37,.40,'projects');laptopSmiski.name='smiski-laptop';laptopSmiski.rotation.y=.15;
const smiskiGreen='#b4c67e',laptopGreen='#7e9f61';
ball(0,.26,0,.13,.20,.12,smiskiGreen,laptopSmiski);ball(0,.57,0,.225,.23,.205,smiskiGreen,laptopSmiski);
for(const side of [-1,1]){
 const leg=ball(side*.085,.085,.13,.065,.07,.16,smiskiGreen,laptopSmiski);leg.rotation.x=-.2;
 ball(side*.075,.585,.19,.018,.021,.011,'#466542',laptopSmiski);
 rod([side*.12,.37,.02],[side*.16,.25,.18],.039,smiskiGreen,laptopSmiski);
 ball(side*.15,.245,.19,.044,.035,.045,smiskiGreen,laptopSmiski);
}
rod([-.035,.50,.2],[.035,.50,.2],.008,'#466542',laptopSmiski);
cube(0,.185,.23,.37,.025,.29,.018,laptopGreen,laptopSmiski);
const laptopLid=cube(0,.335,.345,.38,.28,.024,.023,laptopGreen,laptopSmiski);laptopLid.rotation.x=-.16;
ball(0,.335,.363,.035,.035,.006,'#ced9ae',laptopSmiski);
// The exact Pinterest cat print, mounted above the project shelf.
const portrait=group(-1.65,2.62,-1.82,'projects');portrait.name='projects-wall-frame';cube(0,0,0,1.18,1.3,.12,.04,'#a47a51',portrait);cube(0,0,.08,1.02,1.14,.03,.02,'#f4e4bc',portrait);const portraitPhoto=photo('assets/projects-cat.jpg',.98,.98*674/735,portrait);portraitPhoto.name='projects-cat-print';portraitPhoto.position.z=.16;
// Framed GitHub print on the left wall, linked to Laraib's profile.
const githubFrame=group(-2.82,2.35,-.65,'github');githubFrame.name='github-wall-frame';githubFrame.rotation.y=Math.PI/2;
cube(0,0,0,1.42,1.35,.13,.055,'#ad8959',githubFrame);cube(0,0,.079,1.28,1.21,.035,.025,'#daceaa',githubFrame);
const githubPrint=photo('assets/github-wall.svg',1.17,1.10,githubFrame);githubPrint.position.z=.16;
// Matching LinkedIn print, next to GitHub on the left wall.
const linkedinFrame=group(-2.82,2.35,.9,'linkedin');linkedinFrame.name='linkedin-wall-frame';linkedinFrame.rotation.y=Math.PI/2;
cube(0,0,0,1.28,1.35,.13,.055,'#ad8959',linkedinFrame);cube(0,0,.079,1.14,1.21,.035,.025,'#daceaa',linkedinFrame);
const linkedinPrint=photo('assets/linkedin-wall.svg',1.03,1.10,linkedinFrame);linkedinPrint.position.z=.16;
// Rabbit figurine with real volume, tiny eyes, long ears and green overalls.
const bunny=group(2.2,1.33,-1.0,'education');ball(0,.15,0,.18,.23,.14,'#f3e5c6',bunny);ball(0,.45,.01,.23,.22,.2,'#f5e9d2',bunny);for(const side of [-1,1]){const ear=ball(side*.115,.78,0,.075,.23,.065,'#f5e9d2',bunny);ear.rotation.z=-side*.12;ball(side*.07,.47,.195,.017,.024,.01,'#364b37',bunny);ball(side*.11,-.02,.06,.08,.06,.11,'#ede1c4',bunny);}cube(0,.13,.07,.28,.24,.15,.08,'#849e7b',bunny);ball(0,.39,.215,.025,.016,.01,'#b67960',bunny);cube(2.2,1.22,-1.15,.8,.16,.62,.04,'#b98d5c');
// Snow globe with a tiny cottage inside: opens the projects shelf.
const globe=group(-1.05,1.38,.98,'projects');ball(0,.09,0,.32,.09,.3,'#a16e50',globe);cube(0,.24,0,.21,.23,.19,.035,'#ead5a5',globe);const roof=cube(0,.39,0,.26,.08,.25,.025,'#55765b',globe);roof.rotation.z=.12;ball(-.17,.25,.07,.09,.15,.08,'#789569',globe);const glass=ball(0,.37,0,.34,.35,.34,material('#d7e9d8',{transparent:true,opacity:.2,roughness:.08,metalness:.08}),globe);glass.castShadow=false;
// A mug for contact, an envelope, and a small ceramic cat by the desk.
const mug=group(1.52,1.4,1.04,'contact');const cup=m(new THREE.CylinderGeometry(.16,.12,.24,24),'#be6952',mug);cup.position.y=.12;const tea=m(new THREE.CircleGeometry(.13,24),'#72563e',mug);tea.rotation.x=-Math.PI/2;tea.position.y=.244;const handle=m(new THREE.TorusGeometry(.1,.025,8,24),'#be6952',mug);handle.position.set(.17,.13,0);handle.rotation.y=Math.PI/2;
// Denim résumé envelope, stitched edges, hinged triangular flap and rising document.
function denimTexture(){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#264563';ctx.fillRect(0,0,256,256);ctx.lineWidth=1;for(let i=-256;i<512;i+=4){ctx.strokeStyle=i%8===0?'#6e879a':'#152f4d';ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i-180,256);ctx.stroke();}for(let y=0;y<256;y+=7){ctx.strokeStyle='#92a3ac25';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(256,y+8);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
const denim=material('#ffffff',{map:denimTexture(),roughness:1}),denimDark=material('#b9c7d5',{map:denimTexture(),roughness:1});
const envelope=group(.35,1.405,.95,'resume');envelope.name='resume-envelope';envelope.rotation.x=-Math.PI/2;envelope.rotation.z=-.1;
// Actual pocket depth: backing behind paper, sewn front folds in front.
const envelopeBack=m(new THREE.BoxGeometry(1.37,.92,.02),denim,envelope);envelopeBack.name='envelope-pocket-back';envelopeBack.position.z=-.04;
function fabricTriangle(points,parent,color){const shape=new THREE.Shape();shape.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))shape.lineTo(p[0],p[1]);shape.closePath();return m(new THREE.ShapeGeometry(shape),color,parent);}
const insert=m(new THREE.PlaneGeometry(1.15,1.2),new THREE.MeshBasicMaterial({map:paperTex,side:THREE.DoubleSide}),envelope);insert.name='resume-insert';insert.position.set(0,-.18,0);insert.scale.y=1;
const leftFold=fabricTriangle([[-.68,-.46],[-.68,.46],[.2,-.12]],envelope,denimDark);leftFold.position.z=.045;
const rightFold=fabricTriangle([[.68,-.46],[.68,.46],[-.2,-.12]],envelope,denimDark);rightFold.position.z=.047;
const lowerFold=fabricTriangle([[-.68,-.46],[.68,-.46],[0,.12]],envelope,denim);lowerFold.position.z=.055;
const flapHinge=new THREE.Group();flapHinge.name='resume-flap';flapHinge.position.set(0,.46,.062);envelope.add(flapHinge);
const flap=fabricTriangle([[-.68,0],[.68,0],[0,-.6]],flapHinge,denim);flap.material.side=THREE.DoubleSide;
function stitches(a,b,parent){for(let i=0;i<18;i++){const t=i/18,u=(i+.52)/18;rod([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,.075],[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,.075],.006,'#e8a0ae',parent);}}
stitches([-.64,-.42],[0,.08],envelope);stitches([0,.08],[.64,-.42],envelope);stitches([-.62,-.03],[0,-.55],flapHinge);stitches([0,-.55],[.62,-.03],flapHinge);
const heartShape=new THREE.Shape();heartShape.moveTo(0,-.1);heartShape.bezierCurveTo(-.22,.05,-.16,.24,0,.12);heartShape.bezierCurveTo(.16,.24,.22,.05,0,-.1);const heart=m(new THREE.ExtrudeGeometry(heartShape,{depth:.018,bevelEnabled:true,bevelSize:.018,bevelThickness:.015,bevelSegments:3,steps:1}),material('#d2c9bd',{metalness:.65,roughness:.3}),flapHinge);heart.position.set(0,-.47,.07);heart.scale.setScalar(.8);
let envelopeTween=null,envelopeResolve=null,envelopeCamera=null;
window.openDeskEnvelope=()=>new Promise(resolve=>{
 host.classList.add('is-opening-envelope');envelopeResolve=resolve;
 const facing=Math.atan2(camera.position.x-envelope.position.x,camera.position.z-envelope.position.z)-room.rotation.y;
 envelopeCamera={left:camera.left,right:camera.right,top:camera.top,bottom:camera.bottom,zoom:camera.zoom};
 if(!window.gsap||!window.portfolioMotionPlaying){envelope.position.set(.35,1.95,1.2);envelope.rotation.set(0,facing,0);flapHinge.rotation.x=2.65;insert.position.set(0,.92,0);insert.scale.y=1;render();envelopeResolve=null;resolve();return;}
 const halfW=(camera.right-camera.left)/2,halfH=(camera.top-camera.bottom)/2;
 // Aim the close-up at the final upright pose, with room above for the rising sheet.
 const uprightCenter=new THREE.Vector3(.35,2.40,1.2).applyMatrix4(room.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
 const zoom=Math.min(halfW*2/2.15,halfH*2/2.6);
 envelopeTween=window.gsap.timeline({onUpdate:render,onComplete:()=>{envelopeResolve=null;resolve();}})
 .to(envelope.position,{y:1.95,z:1.2,duration:.65,ease:'power2.inOut'},0)
 .to(envelope.rotation,{x:0,y:facing,z:0,duration:.65,ease:'power2.inOut'},0)
 .to(camera,{left:uprightCenter.x-halfW,right:uprightCenter.x+halfW,top:uprightCenter.y+halfH,bottom:uprightCenter.y-halfH,zoom,duration:.7,ease:'power2.inOut'},.05)
 .to(flapHinge.rotation,{x:2.65,duration:.5,ease:'power2.inOut'},.72)
 .to(insert.position,{y:.92,z:0,duration:.85,ease:'power3.out'},1.23)
 .to(insert.position,{y:1.04,duration:.25,ease:'sine.out'},2.08);
});
window.resetDeskEnvelope=()=>{host.classList.remove('is-opening-envelope');envelopeTween?.kill();envelopeResolve?.();envelopeResolve=null;if(envelopeCamera){Object.assign(camera,envelopeCamera);envelopeCamera=null;}envelope.position.set(.35,1.405,.95);envelope.rotation.set(-Math.PI/2,0,-.1);flapHinge.rotation.x=0;insert.position.set(0,-.18,0);insert.scale.y=1;render();};
const cat=group(-2.1,.3,1.0,'resume');ball(0,.15,0,.34,.17,.22,'#ead5b1',cat);ball(.18,.28,.07,.18,.17,.17,'#efdfc1',cat);for(const side of [-1,1]){const ear=m(new THREE.ConeGeometry(.06,.14,3),'#c59c74',cat);ear.position.set(.18+side*.1,.44,.06);ball(.18+side*.055,.3,.23,.012,.009,.01,'#4d5137',cat);}const tail=m(new THREE.TorusGeometry(.13,.04,8,20,Math.PI*1.6),'#b08a64',cat);tail.rotation.x=Math.PI/2;tail.position.set(-.2,.15,-.06);
// A mushroom task lamp is a real light switch, not an unrelated decoration.
const mushroom=group(-1.3,1.4,-.05,'lamp');rod([0,0,0],[0,.33,0],.05,'#d8cba7',mushroom);ball(0,.35,0,.24,.12,.22,'#c2825d',mushroom);for(const[x,z]of [[-.1,.06],[.08,.08],[.04,-.08]])ball(x,.43,z,.035,.015,.035,'#f3e4c2',mushroom);const lampLight=new THREE.PointLight(0xffcf83,0,4);lampLight.position.set(-1.1,1.85,.5);room.add(lampLight);
// Small plant, star charm and books on the floor fill depth without blocking documents.
const plant=group(-2.5,.25,-.3,'education');const pot=m(new THREE.CylinderGeometry(.2,.14,.3,18),'#ba785a',plant);pot.position.y=.15;for(let i=0;i<5;i++){const a=i*1.2;rod([0,.3,0],[Math.cos(a)*.18,.7+i*.04,Math.sin(a)*.13],.012,'#5f7d50',plant);const leaf=ball(Math.cos(a)*.2,.65+i*.04,Math.sin(a)*.16,.1,.2,.05,'#86a86e',plant);leaf.rotation.z=Math.cos(a)*.65;}
const notes=group(2.05,.35,1.2,'resume');for(let i=0;i<3;i++){const b=cube(0,i*.11,0,.65,.09,.48,.025,['#d9c68b','#8ca379','#b76d57'][i],notes);b.rotation.y=i*.13;}
const markers={projectFrame:new THREE.Vector3(-1.65,2.62,-1.60),github:new THREE.Vector3(-2.70,2.35,-.65),linkedin:new THREE.Vector3(-2.70,2.35,.9),resume:new THREE.Vector3(.3,1.4,1.05),projects:new THREE.Vector3(-1.75,1.45,-.9),education:new THREE.Vector3(1.45,2.1,-1.7),contact:new THREE.Vector3(1.55,1.45,1.05)};
let visible=false,frame,last=0,target=0,drag=null,dragged=false;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
function markerPositions(){const rect=host.getBoundingClientRect();const r={width:host.clientWidth||rect.width,height:host.clientHeight||rect.height};if(!r.width)return;const placed=[];for(const[name,point]of Object.entries(markers)){const el=host.querySelector('[data-target="'+name+'"]');if(!el)continue;const p=point.clone().applyMatrix4(room.matrixWorld).project(camera),width=el.offsetWidth||90;let x=Math.min(r.width-width/2-8,Math.max(width/2+8,(p.x+1)*r.width/2)),y=(-p.y+1)*r.height/2;for(const prev of placed)if(Math.abs(x-prev.x)<(width+prev.width)/2+7&&Math.abs(y-prev.y)<48)y=prev.y+51;y=Math.max(42,Math.min(r.height-65,y));placed.push({x,y,width});el.style.left=x+'px';el.style.top=y+'px';}}
function updateResumePaper(){
 const top=.6,bottom=-.6,mouth=.47;
 const visibleBottom=Math.max(bottom,mouth-insert.position.y);
 insert.visible=visibleBottom<top;
 if(!insert.visible)return;
 const positions=insert.geometry.attributes.position,uv=insert.geometry.attributes.uv;
 positions.setY(2,visibleBottom);positions.setY(3,visibleBottom);positions.needsUpdate=true;
 const uvBottom=(visibleBottom-bottom)/(top-bottom);uv.setY(2,uvBottom);uv.setY(3,uvBottom);uv.needsUpdate=true;
}
function render(){updateResumePaper();camera.updateProjectionMatrix();scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);renderer.render(scene,camera);markerPositions();}
function size(){const rect=host.getBoundingClientRect(),r={width:host.clientWidth||rect.width,height:host.clientHeight||rect.height};if(!r.width||!r.height)return;camera.updateMatrixWorld(true);room.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(room),corners=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));const xs=corners.map(p=>p.x),ys=corners.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),aspect=r.width/r.height;const height=Math.max(maxY-minY,(maxX-minX)/aspect)*1.12,cx=(minX+maxX)/2,cy=(minY+maxY)/2;camera.left=cx-height*aspect/2;camera.right=cx+height*aspect/2;camera.top=cy+height/2;camera.bottom=cy-height/2;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height,false);render();}
function tick(t){frame=requestAnimationFrame(tick);if(!visible||document.hidden||t-last<40)return;const dt=last?Math.min((t-last)/1000,.1):0;last=t;const moving=window.portfolioMotionPlaying;if(moving){avatar.scale.y=1+Math.sin(t*.0015)*.008;if(waveRemaining>0){waveRemaining=Math.max(0,waveRemaining-dt);waveArm.rotation.z=-.9+Math.sin(waveRemaining*13)*.32;head.rotation.z=Math.sin(waveRemaining*3)*.055;}else{waveArm.rotation.z=-.3;head.rotation.z=0;}room.rotation.y+=(target-room.rotation.y)*.1;cat.scale.y=1+Math.sin(t*.002)*.025;bunny.rotation.y=Math.sin(t*.001)*.1;}render();}
function act(route){if(route==='avatar'){window.waveLaraib();return;}if(route==='github'||route==='linkedin'){document.querySelector('#'+route+'-wall-link')?.click();return;}if(route==='lamp'){document.querySelector('#lamp-switch').click();return;}window.location.hash=route;}
canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,angle:target};dragged=false;});canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){dragged=true;target=THREE.MathUtils.clamp(drag.angle+dx*.003,-.3,.3);room.rotation.y=target;render();}});for(const ev of ['pointerup','pointercancel','pointerleave'])canvas.addEventListener(ev,()=>drag=null);
// Reveal the GitHub label only when the pointer is over its actual 3D frame.
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||drag)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pickables,true)[0];let o=hit?.object;while(o&&!o.userData.route)o=o.parent;const route=o?.userData.route;host.classList.toggle('projects-hover',o===portrait);host.classList.toggle('github-hover',route==='github');host.classList.toggle('linkedin-hover',route==='linkedin');canvas.style.cursor=(route==='github'||route==='linkedin'||route==='avatar'||o===portrait)?'pointer':'';});
canvas.addEventListener('pointerleave',()=>{host.classList.remove('github-hover','linkedin-hover','projects-hover');canvas.style.cursor='';});
canvas.addEventListener('click',e=>{if(dragged)return;const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(pickables,true)[0];if(hit){let o=hit.object;while(o&&!o.userData.route)o=o.parent;if(o)act(o.userData.route);}});canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();target=THREE.MathUtils.clamp(target+(e.key==='ArrowLeft'?-.1:.1),-.3,.3);room.rotation.y=target;render();}if(e.key==='Enter'){e.preventDefault();act('resume');}});
const lampButton=document.querySelector('#lamp-switch');new MutationObserver(()=>{lampLight.intensity=lampButton.getAttribute('aria-pressed')==='true'?2.8:0;render();}).observe(lampButton,{attributes:true,attributeFilter:['aria-pressed']});new ResizeObserver(size).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)size();}).observe(host);new MutationObserver(()=>{if(document.body.dataset.view==='inside')setTimeout(size,40);}).observe(document.body,{attributes:true,attributeFilter:['data-view']});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);host.classList.remove('is-ready');});window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(tick);});size();host.classList.add('is-ready');frame=requestAnimationFrame(tick);
}
