(() => {
 'use strict';
 const text=document.querySelector('#study-tip'),count=document.querySelector('#study-tip-count'),next=document.querySelector('#next-study-tip'),bubble=document.querySelector('.character-speech'),sound=document.querySelector('#study-sound');
 if(!text||!count||!next||!bubble)return;
 const coarse=matchMedia('(pointer: coarse)');let index=0,timer,typing,audio,muted=false,wasInside=false;const voices=new Set();
 function messages(){const action=coarse.matches?'Tap':'Click';return [`${action} the envelope to read my full résumé.`,`${action} the GitHub frame to visit my GitHub.`,`${action} the LinkedIn frame to visit my LinkedIn.`,`${action} the cat frame behind me to see my projects.`];}
 function active(){return document.body.dataset.view==='inside'&&!document.hidden&&!document.querySelector('#document-dialog')?.open;}
 function stopVoice(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 function unlock(){if(muted)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;try{audio||=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
 function chirp(step){if(!audio||audio.state!=='running'||muted||!active()||window.portfolioMotionPlaying===false)return;const now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';const notes=[640,810,720,960,760,880];osc.frequency.setValueAtTime(notes[(Math.floor(step)+index*2)%notes.length],now);osc.frequency.exponentialRampToValueAtTime(notes[(Math.floor(step)+index*2)%notes.length]*.75,now+.055);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.022,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+.06);osc.connect(gain);gain.connect(audio.destination);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(now);osc.stop(now+.065);}
 function draw(animate=true){clearTimeout(typing);stopVoice();const message=messages()[index];count.textContent=`${index+1} / 4`;bubble.dataset.tip=['resume','github','linkedin','projects'][index];if(!animate||!active()||window.portfolioMotionPlaying===false){text.textContent=message;return;}let position=0;text.textContent='';function type(){if(!active()||window.portfolioMotionPlaying===false){text.textContent=message;return;}position=Math.min(position+2,message.length);text.textContent=message.slice(0,position);if(/\S/.test(message.slice(position-2,position)))chirp(position/2);if(position<message.length)typing=setTimeout(type,65);}type();}
 function schedule(){clearTimeout(timer);if(!active()||window.portfolioMotionPlaying===false)return;timer=setTimeout(()=>{if(active()){index=(index+1)%4;draw();}schedule();},7000);}
 function advance(){unlock();index=(index+1)%4;draw();schedule();}
 sound?.addEventListener('click',()=>{muted=!muted;sound.setAttribute('aria-pressed',String(muted));sound.setAttribute('aria-label',muted?'Enable character sounds':'Mute character sounds');sound.textContent=muted?'♪×':'♪';if(muted)stopVoice();else{unlock();draw();schedule();}});
 document.addEventListener('pointerdown',unlock,{passive:true});document.addEventListener('keydown',unlock);
 next.addEventListener('click',advance);window.advanceStudyTip=advance;
 function state(){const inside=active();if(inside&&!wasInside)draw();if(!inside||window.portfolioMotionPlaying===false){clearTimeout(typing);stopVoice();text.textContent=messages()[index];}wasInside=inside;schedule();}
 new MutationObserver(state).observe(document.body,{attributes:true,attributeFilter:['data-view','class']});
 new MutationObserver(state).observe(document.querySelector('#document-dialog'),{attributes:true,attributeFilter:['open']});
 document.addEventListener('visibilitychange',state);coarse.addEventListener('change',()=>draw(false));
 window.addEventListener('pagehide',()=>{clearTimeout(timer);clearTimeout(typing);stopVoice();});window.addEventListener('pageshow',state);
 draw(false);state();
})();
