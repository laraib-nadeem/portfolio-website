(() => {
  const host=document.querySelector('#room-frame'),canvas=document.querySelector('#study-grass');if(!host||!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  // Sparse hand-drawn tufts, inspired by the owner's line-doodle reference.
  const shapes=[
    'M-20 0 L-24-12 -10-3 -14-19 -3-4 2-26 5-4 16-18 11-2 24-9 18 0',
    'M-22 0 L-18-15 -10-4 -7-23 -1-5 8-17 7-3 18-12 15-1 24-6',
    'M-24 0 Q-12 1-13-8 Q-19-21-8-16 L-2-7 Q-7-31 3-26 Q13-23 8-7 Q20-27 24-17 Q28-11 18-1 L30 0',
    'M-23 0 L-15-2 -18-10 -7-3 -4-18 2-4 9-12 8-2 17-8 14 0 24 1'
  ].map(d=>new Path2D(d));
  function draw(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const viewH=h-76,b=window.studyPlacement?.gardenBounds?.()||{top:viewH/2-w*.4,bottom:viewH/2+w*.4};
    const top=Math.max(30,b.top),bottom=Math.max(b.bottom+16,top+35),end=h-84,space=Math.max(0,end-bottom);
    const patches=[[.16,top*.44,.6],[.46,top*.29,.7],[.79,top*.57,.56],[.07,top*.86,.48],[.92,top*.81,.52],[.18,bottom+space*.25,.64],[.47,bottom+space*.63,.6],[.76,bottom+space*.24,.7],[.88,bottom+space*.72,.48]];
    ctx.strokeStyle='#9bad79';ctx.lineWidth=1.3;ctx.lineCap='round';ctx.lineJoin='round';ctx.globalAlpha=.63;
    patches.forEach(([x,y,scale],i)=>{if(y>end||y<15)return;ctx.save();ctx.translate(x*w,y);ctx.scale(scale,scale);ctx.stroke(shapes[i%shapes.length]);ctx.restore();});ctx.globalAlpha=1;
  }
  const schedule=()=>requestAnimationFrame(draw);new ResizeObserver(schedule).observe(host);window.addEventListener('study-placement-ready',schedule);window.addEventListener('study-garden-layout',schedule);draw();
})();
