(() => {
  const host=document.querySelector('#room-frame'),canvas=document.querySelector('#study-grass');
  if(!host||!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx)return;
  const random=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
  function draw(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);ctx.textAlign='center';ctx.textBaseline='middle';
    const gapX=19,gapY=18,blades=['/|\\','\\|/','/\\','|',"'",',','v'];
    for(let row=0;row<Math.ceil(h/gapY);row++)for(let col=0;col<Math.ceil(w/gapX);col++){
      const seed=row*313+col*17;if(random(seed)<.28)continue;
      const x=col*gapX+(row%2?9:0)+(random(seed+1)-.5)*7,y=row*gapY+9+(random(seed+2)-.5)*6;
      const shade=Math.floor(random(seed+3)*3),alpha=.26+random(seed+4)*.2;
      ctx.fillStyle=['rgba(143,166,105,','rgba(112,145,85,','rgba(173,185,126,'][shade]+alpha+')';ctx.font=(9+Math.floor(random(seed+5)*3))+'px monospace';ctx.fillText(blades[Math.floor(random(seed+6)*blades.length)],x,y);
    }
  }
  new ResizeObserver(draw).observe(host);draw();
})();
