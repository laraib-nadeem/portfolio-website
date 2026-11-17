(() => {
 'use strict';
 const text=document.querySelector('#study-tip'),count=document.querySelector('#study-tip-count'),next=document.querySelector('#next-study-tip'),bubble=document.querySelector('.character-speech');
 if(!text||!count||!next||!bubble)return;
 const coarse=matchMedia('(pointer: coarse)');let index=0,timer;
 function messages(){const action=coarse.matches?'Tap':'Click';return [
  `${action} the envelope to read my full résumé.`,
  `${action} the GitHub frame to visit my GitHub.`,
  `${action} the LinkedIn frame to visit my LinkedIn.`,
  `${action} the cat frame behind me to see my projects.`
 ];}
 function draw(){text.textContent=messages()[index];count.textContent=`${index+1} / 4`;bubble.dataset.tip=['resume','github','linkedin','projects'][index];}
 function schedule(){clearTimeout(timer);if(document.body.dataset.view!=='inside'||document.hidden||window.portfolioMotionPlaying===false)return;timer=setTimeout(()=>{if(!document.querySelector('#document-dialog')?.open){index=(index+1)%4;draw();}schedule();},6500);}
 function advance(){index=(index+1)%4;draw();schedule();}
 next.addEventListener('click',advance);window.advanceStudyTip=advance;
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-view','class']});
 document.addEventListener('visibilitychange',schedule);coarse.addEventListener('change',draw);
 window.addEventListener('pagehide',()=>clearTimeout(timer));window.addEventListener('pageshow',schedule);
 draw();schedule();
})();
