(() => {
  const host=document.querySelector('#room-frame'),svg=document.querySelector('.study-ladybugs');if(!host||!svg)return;
  // Separate winding circuits cover top, sides, and middle, with vertical segments.
  const routes=[[[.12,.12],[.35,.03],[.57,.17],[.82,.06],[.92,.30],[.92,.49],[.73,.61],[.89,.82],[.63,.91],[.40,.70],[.14,.88],[.06,.64],[.22,.43],[.08,.24]],[[.84,.08],[.73,.27],[.86,.44],[.61,.55],[.61,.75],[.44,.9],[.28,.7],[.10,.52],[.20,.30],[.36,.45],[.44,.18],[.62,.06]]];
  function resize(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const margin=23,travelW=Math.max(1,w-margin*2),travelH=Math.max(1,h-98-margin);
    routes.forEach((route,i)=>{
      const points=route.map(([x,y])=>[margin+x*travelW,margin+y*travelH]);
      const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
      const start=mid(points.at(-1),points[0]);let d=`M${start.join(' ')}`;
      for(let j=0;j<points.length;j++)d+=` Q${points[j].join(' ')} ${mid(points[j],points[(j+1)%points.length]).join(' ')}`;
      const bug=svg.querySelector('.ladybug-'+(i+1));if(bug)bug.style.offsetPath=`path("${d} Z")`;
    });
  }
  new ResizeObserver(resize).observe(host);resize();
})();
