(() => {
  const button=document.querySelector('#music-toggle');if(!button)return;
  const audio=new Audio('assets/audio/local-forecast-slower.mp3?v=half3');audio.loop=true;audio.preload='none';audio.volume=.10;audio.id='site-background-music';audio.hidden=true;audio.setAttribute('aria-hidden','true');document.body.append(audio);
  let enabled=false,starting=false,position=0;
  try{enabled=localStorage.getItem('laraib-music-enabled')==='true';position=Number(sessionStorage.getItem('laraib-music-position'))||0;}catch{}
  function store(){try{localStorage.setItem('laraib-music-enabled',String(enabled));if(audio.readyState)sessionStorage.setItem('laraib-music-position',String(audio.currentTime));}catch{}}
  function update(){const playing=!audio.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Pause background music':'Play background music');button.title=playing?'Pause music — Local Forecast – Slower':'Play cozy background music';button.classList.toggle('music-playing',playing);}
  audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)&&position>0)audio.currentTime=position%audio.duration;});
  async function play(){if(starting||!audio.paused)return;starting=true;try{await audio.play();}catch{update();}finally{starting=false;}}
  button.addEventListener('click',()=>{if(!audio.paused){enabled=false;audio.pause();}else{enabled=true;play();}store();update();});
  audio.addEventListener('play',update);audio.addEventListener('pause',update);
  audio.addEventListener('error',()=>{button.title='Music could not load. Tap to try again.';update();});
  // Saved listeners can resume on the next gesture if browser autoplay is blocked.
  document.addEventListener('pointerdown',e=>{if(enabled&&audio.paused&&!button.contains(e.target))play();},{passive:true});
  document.addEventListener('keydown',e=>{if(enabled&&audio.paused&&!button.contains(e.target)&&!e.repeat)play();});
  window.addEventListener('pagehide',()=>{store();audio.pause();});window.addEventListener('pageshow',event=>{if(!event.persisted)return;try{enabled=localStorage.getItem('laraib-music-enabled')==='true';position=Number(sessionStorage.getItem('laraib-music-position'))||0;if(audio.readyState&&Number.isFinite(audio.duration))audio.currentTime=position%audio.duration;}catch{}if(enabled)play();else audio.pause();update();});setInterval(()=>{if(!audio.paused)store();},1500);
  update();if(enabled)play();
})();
