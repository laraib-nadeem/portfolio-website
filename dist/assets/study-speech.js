(() => {
 'use strict';
 const text=document.querySelector('#study-tip'),bubble=document.querySelector('.character-speech'),sound=document.querySelector('#study-sound');
 if(!text||!bubble)return;
 const coarse=matchMedia('(pointer: coarse)'),voices=new Set();let index=0,begun=false,finished=false,introTimer,lineTimer,holdTimer,audio,muted=false;
 bubble.hidden=true;
 function messages(){const action=coarse.matches?'Tap':'Click';return [`${action} the envelope for my full résumé.`,`${action} the GitHub frame for my profile.`,`${action} the LinkedIn frame for my profile.`,`${action} the Smiski for technical projects.`];}
 function active(){return document.body.dataset.view==='inside'&&!document.hidden&&!document.querySelector('#document-dialog')?.open&&!document.querySelector('#room-frame')?.classList.contains('is-opening-envelope');}
 function stopVoice(){for(const voice of voices){try{voice.stop();}catch{}}voices.clear();}
 function clearTimers(){clearTimeout(introTimer);clearTimeout(lineTimer);clearTimeout(holdTimer);introTimer=lineTimer=holdTimer=null;}
 function unlock(){if(muted||finished)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;try{audio||=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
 function chirp(step){if(!audio||audio.state!=='running'||muted||!active()||window.portfolioMotionPlaying===false)return;const now=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain(),notes=[640,810,720,960,760,880],pitch=notes[(step+index*2)%notes.length];osc.type='triangle';osc.frequency.setValueAtTime(pitch,now);osc.frequency.exponentialRampToValueAtTime(pitch*.75,now+.055);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.070,now+.008);gain.gain.exponentialRampToValueAtTime(.001,now+.06);osc.connect(gain);gain.connect(audio.destination);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();gain.disconnect();};osc.start(now);osc.stop(now+.065);}
 function finish(){finished=true;clearTimers();stopVoice();bubble.hidden=true;if(sound)sound.hidden=true;}
 function hold(){holdTimer=setTimeout(()=>{holdTimer=null;if(!active())return;if(index===3){finish();return;}index++;speak();},2300);}
 function speak(){if(finished||!active())return;bubble.hidden=false;bubble.dataset.tip=['resume','github','linkedin','projects'][index];const message=messages()[index];let position=0;text.textContent='';function type(){lineTimer=null;if(!active())return;if(window.portfolioMotionPlaying===false){text.textContent=message;hold();return;}position=Math.min(position+2,message.length);text.textContent=message.slice(0,position);if(/\S/.test(message.slice(Math.max(0,position-2),position)))chirp(Math.floor(position/2));if(position<message.length)lineTimer=setTimeout(type,65);else hold();}type();}
 function state(){if(finished){bubble.hidden=true;return;}if(!active()){clearTimers();stopVoice();bubble.hidden=true;return;}if(!begun){if(!introTimer)introTimer=setTimeout(()=>{introTimer=null;if(!active())return;begun=true;speak();},1500);return;}if(window.portfolioMotionPlaying===false){clearTimeout(lineTimer);lineTimer=null;stopVoice();text.textContent=messages()[index];}bubble.hidden=false;if(!lineTimer&&!holdTimer){text.textContent=messages()[index];hold();}}
 sound?.addEventListener('click',()=>{if(finished)return;muted=!muted;sound.setAttribute('aria-pressed',String(muted));sound.setAttribute('aria-label',muted?'Enable character sounds':'Mute character sounds');sound.textContent=muted?'♪×':'♪';if(muted)stopVoice();else unlock();});
 // The normal tap on Enter my study unlocks iOS audio before the delayed greeting.
 document.addEventListener('pointerdown',unlock,{capture:true,passive:true});document.addEventListener('touchend',unlock,{capture:true,passive:true});document.addEventListener('keydown',unlock,{capture:true});
 new MutationObserver(state).observe(document.body,{attributes:true,attributeFilter:['data-view','class']});
 for(const selector of ['#document-dialog','#room-frame']){const el=document.querySelector(selector);if(el)new MutationObserver(state).observe(el,{attributes:true,attributeFilter:['open','class']});}
 document.addEventListener('visibilitychange',state);coarse.addEventListener('change',()=>{if(begun&&!finished)text.textContent=messages()[index];});
 window.addEventListener('pagehide',()=>{clearTimers();stopVoice();});window.addEventListener('pageshow',state);state();
})();
