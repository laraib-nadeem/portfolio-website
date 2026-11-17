(() => {
  const host=document.querySelector('#room-frame'),svg=document.querySelector('.study-ladybugs');if(!host||!svg)return;
  function resize(){
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const viewH=h-76,b=window.studyPlacement?.gardenBounds?.()||{top:viewH/2-w*.4,bottom:viewH/2+w*.4};
    const top=[22,Math.max(24,b.top-18)],bottom=[Math.min(h-108,b.bottom+20),h-91];
    // One winds through the upper garden, one through the lower garden.
    // Both layers sit behind the house as an extra safeguard against overlap.
    const routes=[[[.10,.35],[.29,.05],[.51,.81],[.73,.12],[.91,.48],[.72,.98],[.47,.4],[.24,.94]],[[.12,.25],[.34,.95],[.57,.15],[.83,.86],[.92,.34],[.70,.02],[.49,.74],[.27,.08]]];
    routes.forEach((route,i)=>{const zone=i===0||bottom[1]-bottom[0]<25?top:bottom;const points=route.map(([x,y])=>[24+x*Math.max(1,w-48),zone[0]+y*Math.max(1,zone[1]-zone[0])]);const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let d=`M${mid(points.at(-1),points[0]).join(' ')}`;for(let j=0;j<points.length;j++)d+=` Q${points[j].join(' ')} ${mid(points[j],points[(j+1)%points.length]).join(' ')}`;svg.querySelector('.ladybug-'+(i+1)).style.offsetPath=`path("${d} Z")`;});
  }
  const schedule=()=>requestAnimationFrame(resize);new ResizeObserver(schedule).observe(host);window.addEventListener('study-placement-ready',schedule);window.addEventListener('study-garden-layout',schedule);resize();
})();
