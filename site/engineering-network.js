'use strict';

// The anchors use coordinates from the 1536 x 1024 engineering illustration.
// CSS background positioning and canvas positioning share the same transform.
(function(){
 const electronics=new URLSearchParams(location.search).get("background")!=="classic";
 document.documentElement.dataset.background=electronics?"electronics":"classic";
 document.querySelectorAll('[data-engineering-surface],.company,.capabilities,.ai-support,.workflow,.fit,.faq,.contact,.site-footer').forEach(function engineeringObjects(hero){
 const light=hero.matches('.company,.capabilities,.ai-support,.workflow,.fit,.faq,.contact');
 const staticArtwork=light||hero.matches('.site-footer');
 let canvas=hero.querySelector('[data-engineering-canvas]');
 if(!canvas){canvas=document.createElement('canvas');canvas.className='engineering-network';canvas.setAttribute('data-engineering-canvas','');canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);}
 hero.setAttribute('data-engineering-surface',light?'light':'dark');
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Candidate paths follow actual object strokes, never the dimension grid.
 // Re-select three spread-out anchors from the visible crop after every resize.
 let groups=[
  {name:'Drafting board',paths:[[[0,88],[304,34],[477,246],[85,375],[0,203]],[[0,323],[91,376],[478,250]],[[47,64],[163,244],[165,263],[296,218],[425,201]]]},
  {name:'Drafting triangle',paths:[[[335,143],[463,181],[344,211],[335,143]]]},
  {name:'Mechanical section',paths:[[[0,594],[32,594],[32,577],[60,577],[60,610],[100,610],[121,578],[138,560],[182,560],[182,741],[138,741],[138,678],[61,678],[61,722],[0,722]],[[0,623],[213,623],[218,640],[218,681],[211,692],[182,692]]]},
  {name:'Bolt',paths:[[[46,782],[63,782],[69,791],[167,791],[167,808],[69,808],[63,819],[46,819],[46,782]]]},
  {name:'Nut',points:[[196,800],[202,779],[220,773],[240,780],[249,800],[240,820],[219,829],[199,817]]},
  {name:'Caliper',paths:[[[35,856],[263,909],[252,947],[208,1001],[203,1004]],[[163,980],[171,947],[35,906]],[[198,888],[203,882],[217,893],[232,879],[239,894],[225,907]]]},
  {name:'Compass',paths:[[[345,735],[352,735],[350,779]],[[347,781],[301,958],[293,969]],[[350,783],[389,958],[389,966]]],points:[[335,781],[348,770],[360,781],[348,795],[317,885]]},
  {name:'Circular flange',reach:190,ring:[483,897,76]},
  {name:'Software architecture',paths:[[[1214,39],[1311,39],[1311,64],[1214,64],[1214,39]],[[1214,92],[1311,92],[1311,117],[1214,117],[1214,92]],[[1148,151],[1214,151],[1214,185],[1148,185],[1148,151]],[[1230,151],[1297,151],[1297,185],[1230,185],[1230,151]],[[1316,151],[1384,151],[1384,185],[1316,185],[1316,151]],[[1174,218],[1256,218],[1256,247],[1174,247],[1174,218]],[[1288,218],[1370,218],[1370,247],[1288,247],[1288,218]],[[1243,294],[1243,323],[1272,334],[1301,323],[1301,294],[1272,285],[1243,294]]]},
  {name:'Software flowchart',paths:[[[1448,255],[1480,255],[1480,273],[1448,273],[1448,255]],[[1467,291],[1490,305],[1467,319],[1444,305],[1467,291]],[[1440,334],[1492,334],[1492,351],[1440,351],[1440,334]]]},
  {name:'Neural network',paths:[[[1234,550],[1294,540],[1353,540],[1412,540],[1486,570],[1412,638],[1353,638],[1294,638],[1234,628]],[[1412,573],[1486,603],[1412,605]]],points:[[1234,550],[1234,577],[1234,602],[1234,628],[1294,540],[1294,573],[1294,605],[1294,638],[1353,540],[1353,573],[1353,605],[1353,638],[1412,540],[1412,573],[1412,605],[1412,638],[1486,570],[1486,603]]},
  {name:'Training graph',paths:[[[1089,665],[1095,696],[1107,722],[1129,744],[1167,758],[1210,766],[1266,773]]]},
  {name:'Gear drawing',ring:[1330,932,89]},
  {name:'Lower gear',ring:[1193,958,81]}
 ];
 // The light drawing is a separate illustration: its objects have their own coordinates.
 if(light||electronics){
  const lightOverrides={
   'Drafting board':{paths:[[[0,87],[302,31],[470,247],[88,376],[0,200]],[[0,322],[88,376],[470,247]],[[47,64],[163,244],[165,263],[296,218],[425,201]]]},
   'Drafting triangle':{paths:[[[330,140],[458,180],[340,211],[330,140]]]},
   'Mechanical section':{paths:[[[0,568],[33,568],[33,595],[96,595],[122,572],[140,550],[182,550],[182,734],[139,734],[139,685],[61,685],[61,716],[0,716]],[[0,622],[213,622],[223,640],[223,679],[210,685],[182,685]]]},
   'Bolt':{paths:[[[42,780],[58,780],[64,787],[156,787],[156,812],[64,812],[58,822],[42,822],[42,780]]]},
   'Nut':{points:[[178,796],[189,778],[209,778],[222,797],[211,818],[188,818]]},
   'Compass':{paths:[[[337,730],[344,730],[342,776]],[[341,776],[295,955],[290,960]],[[342,778],[383,951],[383,960]]],points:[[328,776],[341,763],[354,776],[341,789],[312,882]]},
   'Circular flange':{ring:[478,895,72]},
   'Software architecture':{paths:[[[1215,44],[1309,44],[1309,70],[1215,70],[1215,44]],[[1215,90],[1309,90],[1309,117],[1215,117],[1215,90]],[[1134,153],[1207,153],[1207,187],[1134,187],[1134,153]],[[1221,153],[1302,153],[1302,187],[1221,187],[1221,153]],[[1317,153],[1389,153],[1389,187],[1317,187],[1317,153]],[[1209,209],[1311,209],[1311,246],[1209,246],[1209,209]],[[1234,276],[1234,302],[1261,311],[1289,302],[1289,276],[1261,269],[1234,276]]]},
   'Software flowchart':{points:[]},
   'Gear drawing':{ring:[1348,929,79]},
   'Lower gear':{ring:[1193,969,72]}
  };
  groups.forEach(group=>{const replacement=lightOverrides[group.name];if(!replacement)return;delete group.points;delete group.paths;delete group.ring;Object.assign(group,replacement);});
 }
 if(electronics)groups=groups.filter(group=>!["Drafting board","Drafting triangle","Software architecture","Software flowchart"].includes(group.name)).concat([{"name":"Processor and printed circuit board","points":[[29,99],[112,286],[406,207],[91,112],[221,77],[291,174],[160,214],[127,332]]},{"name":"Oscilloscope","points":[[0.0,552.6],[185.76,561.24],[185.76,667.08],[0.0,675.72],[159.84,646.2],[132.48,579.24],[110.16,650.52]]},{"name":"Industrial robot arm","paths":[[[1170,311],[1170,296],[1191,287],[1191,251]],[[1207,206],[1144,127],[1135,115],[1168,86]],[[1156,84],[1279,30],[1299,65],[1177,126]],[[1312,43],[1392,115],[1370,141],[1294,72]],[[1419,207],[1433,220],[1433,252],[1443,252]],[[1456,193],[1472,205],[1472,245],[1462,245]]]},{"name":"Assembly conveyor","paths":[[[1130,318],[1515,318],[1515,341],[1130,341],[1130,318]],[[1148,341],[1148,371],[1162,371],[1162,341]],[[1482,341],[1482,371],[1496,371],[1496,341]]]}]);
 if(electronics){const section=groups.find(group=>group.name==="Mechanical section");section.paths=section.paths.map(path=>path.map(([x,y])=>[x,y-200]));for(const group of groups.filter(g=>["Neural network","Training graph"].includes(g.name))){if(group.points)group.points=group.points.map(([x,y])=>[x,y-140]);if(group.paths)group.paths=group.paths.map(path=>path.map(([x,y])=>[x,y-140]));}}
 groups.forEach(group=>{
  const candidates=(group.points||[]).slice();
  (group.paths||[]).forEach(path=>path.slice(1).forEach((end,index)=>{
   const start=path[index],steps=Math.max(1,Math.ceil(Math.hypot(end[0]-start[0],end[1]-start[1])/10));
   for(let step=0;step<=steps;step++)candidates.push([start[0]+(end[0]-start[0])*step/steps,start[1]+(end[1]-start[1])*step/steps]);
  }));
  if(group.ring)for(let step=0;step<48;step++){
   const angle=step/48*Math.PI*2;
   candidates.push([group.ring[0]+Math.cos(angle)*group.ring[2],group.ring[1]+Math.sin(angle)*group.ring[2]]);
  }
  group.candidates=candidates;group.anchors=[];group.visiblePoints=[];
 });
 const pointer={x:0,y:0,targetX:0,targetY:0,active:false};
 let width=0,height=0,scale=1,offsetX=0,offsetY=0,backgroundAlpha=.24;
 let canvasLeft=0,canvasTop=0;
 let paused=reduced.matches,visible=true,frame=0,last=0,time=0;
 const strengths=groups.map(()=>0);
 let logoContours=[];
 const logoImage=new Image();
 logoImage.src='assets/linkport-symbol-reference.png';
 logoImage.addEventListener('load',()=>{
  // Trace the supplied symbol, preserving its actual silhouette and inner cuts.
  const sample=document.createElement('canvas');
  sample.width=logoImage.naturalWidth;sample.height=logoImage.naturalHeight;
  const read=sample.getContext('2d',{willReadFrequently:true});
  read.drawImage(logoImage,0,0);
  const w=sample.width,h=sample.height,pixels=read.getImageData(0,0,w,h).data;
  const mask=new Uint8Array(w*h);
  let minX=w,minY=h,maxX=0,maxY=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const i=(y*w+x)*4;
   if(pixels[i+3]>100&&Math.min(pixels[i],pixels[i+1],pixels[i+2])<185){
    mask[y*w+x]=1;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x+1);maxY=Math.max(maxY,y+1);
   }
  }
  const filled=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&mask[y*w+x];
  const edges=[];const starts=new Map();
  function edge(ax,ay,bx,by){const index=edges.length;edges.push({a:[ax,ay],b:[bx,by],used:false});const key=ax+','+ay;if(!starts.has(key))starts.set(key,[]);starts.get(key).push(index);}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(filled(x,y)){
   if(!filled(x,y-1))edge(x,y,x+1,y);
   if(!filled(x+1,y))edge(x+1,y,x+1,y+1);
   if(!filled(x,y+1))edge(x+1,y+1,x,y+1);
   if(!filled(x-1,y))edge(x,y+1,x,y);
  }
  const size=Math.max(maxX-minX,maxY-minY);
  const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
  edges.forEach(first=>{
   if(first.used)return;
   const contour=[];let current=first;
   for(let guard=0;current&&!current.used&&guard<=edges.length;guard++){
    current.used=true;contour.push(current.a);
    const next=(starts.get(current.b[0]+','+current.b[1])||[]).find(index=>!edges[index].used);
    current=next===undefined?null:edges[next];
   }
   if(contour.length<20)return;
   // Uniformly spaced points make a quiet dotted stroke rather than a solid badge.
   logoContours.push(contour.filter((_,index)=>index%2===0).map(point=>({x:(point[0]-centerX)/size,y:(point[1]-centerY)/size})));
  });
  draw();
 });
 let diagramBounds=null;
 let artworkWidth=1536,artworkHeight=1024;
 let strokeAnchorsReady=false;
 const artwork=new Image();
 artwork.src=electronics?'assets/engineering-mixed-v2.svg':(light?'assets/engineering-sketches-light-v1.png':'assets/engineering-sketches-v2.png');
 artwork.addEventListener('load',()=>{
  artworkWidth=artwork.naturalWidth;artworkHeight=artwork.naturalHeight;
  strokeAnchorsReady=true;resize();
 });
 function project(point){return{x:point[0]*scale+offsetX,y:point[1]*scale+offsetY};}
 function resize(){
  const rect=hero.getBoundingClientRect();
  const backdrop=getComputedStyle(hero,'::before');
  canvasLeft=parseFloat(backdrop.left)||0;canvasTop=parseFloat(backdrop.top)||0;
  width=rect.width-canvasLeft-(parseFloat(backdrop.right)||0);height=rect.height-canvasTop-(parseFloat(backdrop.bottom)||0);
  canvas.style.left=canvasLeft+'px';canvas.style.top=canvasTop+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
  ctx.setTransform(ratio,0,0,ratio,0,0);
  backgroundAlpha=parseFloat(backdrop.opacity)||.24;
  const positions=backdrop.backgroundPosition.split(' ');
  const fraction=value=>value.endsWith('%')?parseFloat(value)/100:0;
  const fixedHeight=parseFloat(backdrop.backgroundSize.split(' ')[1]);
  scale=backdrop.backgroundSize==='cover'||!fixedHeight?Math.max(width/artworkWidth,height/artworkHeight):fixedHeight/artworkHeight;
  offsetX=(width-artworkWidth*scale)*fraction(positions[0]);
  offsetY=(height-artworkHeight*scale)*fraction(positions[1]||positions[0]);
  const diagram=hero.querySelector('.system-diagram,.faq-list,#contact-form');
  if(diagram){const bounds=diagram.getBoundingClientRect();diagramBounds={left:bounds.left-rect.left-canvasLeft,right:bounds.right-rect.left-canvasLeft,top:bounds.top-rect.top-canvasTop,bottom:bounds.bottom-rect.top-canvasTop};}
  else diagramBounds=null;
  groups.forEach(updateAnchors);
  draw();
 }
 function covered(point){return diagramBounds&&point.x>diagramBounds.left&&point.x<diagramBounds.right&&point.y>diagramBounds.top&&point.y<diagramBounds.bottom;}
 function shownInSketch(point){
  if(!staticArtwork)return true;
  if(hero.matches(".faq"))return point.x/width<.35&&point.y/height>.42;
  if(hero.matches(".contact"))return (point.x/width<.34&&point.y/height>.45)||point.x/width>.93;
  if(electronics){const x=point.x/width,y=point.y/height;return x<.27||x>.75||y<.23||y>.78;}
  const x=point.x/width,y=point.y/height;
  // Match the quiet central zones of the existing CSS masks; never attach in a blank area.
  if(hero.matches('.site-footer'))return x<.35||x>.7;
  if(hero.matches('.capabilities'))return Math.min(Math.hypot(x,y),Math.hypot(1-x,1-y))<.59;
  return y<.34||y>.64;
 }
 function updateAnchors(group){
  const points=group.candidates.map(project).filter(point=>shownInSketch(point)&&!covered(point)&&point.x>=4&&point.y>=4&&point.x<=width-4&&point.y<=height-4);
  group.visiblePoints=points;group.anchors=[];
  if(points.length<3)return;
  // Choose extrema in the visible drawing; clipping never leaves a single tether.
  const center=points.reduce((sum,p)=>({x:sum.x+p.x/points.length,y:sum.y+p.y/points.length}),{x:0,y:0});
  const distance=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
  group.anchors.push(points.reduce((best,p)=>distance(p,center)>distance(best,center)?p:best));
  while(group.anchors.length<3){
   const separation=p=>Math.min(...group.anchors.map(anchor=>distance(p,anchor)));
   group.anchors.push(points.reduce((best,p)=>separation(p)>separation(best)?p:best));
  }
 }
 function nearbyGroup(){
  if(!strokeAnchorsReady||!pointer.active||covered(pointer))return -1;
  let selected=-1,closest=Infinity;
  groups.forEach((group,index)=>{
   if(group.anchors.length<3)return;
   const reach=Math.min(260,Math.max(group.reach||150,(group.reach||150)*scale));
   group.visiblePoints.forEach(point=>{
    const distance=Math.hypot(point.x-pointer.targetX,point.y-pointer.targetY);
    if(distance<reach&&distance<closest){closest=distance;selected=index;}
   });
  });return selected;
 }
 // Marks are spaced by distance along the curve, not by its animation parameter.
 // Ten short divisions form one longer division; the scale stays rooted at the tool.
 function rulerMarks(start,control,end){
  const divisions=[];
  const estimate=Math.hypot(control.x-start.x,control.y-start.y)+Math.hypot(end.x-control.x,end.y-control.y);
  if(estimate<12)return divisions;
  const steps=Math.max(16,Math.ceil(estimate/3));
  let previous=start,travelled=0,nextMark=4,number=1;
  for(let step=1;step<=steps;step++){
   const t=step/steps,u=1-t;
   const point={x:u*u*start.x+2*u*t*control.x+t*t*end.x,y:u*u*start.y+2*u*t*control.y+t*t*end.y};
   const dx=point.x-previous.x,dy=point.y-previous.y,length=Math.hypot(dx,dy);
   while(length>0&&nextMark<=travelled+length){
    const part=(nextMark-travelled)/length;
    if(nextMark<estimate-3){
     const x=previous.x+dx*part,y=previous.y+dy*part;
     const major=number%10===0,size=major?4.8:1.8;
     divisions.push({x,y,endX:x-dy/length*size,endY:y+dx/length*size,major});
    }
    nextMark+=4;number++;
   }
   travelled+=length;previous=point;
  }
  return divisions;
 }
 function draw(){
  ctx.clearRect(0,0,width,height);
  // Paint the sketch and the anchored lines with the very same transform.
  // There is no independent CSS background crop to drift out of alignment.
  if(strokeAnchorsReady&&!staticArtwork){
   ctx.save();ctx.globalAlpha=backgroundAlpha;
   ctx.drawImage(artwork,offsetX,offsetY,artworkWidth*scale,artworkHeight*scale);
   ctx.restore();
  }
  groups.forEach((group,index)=>{
   const strength=strengths[index];
   group.anchors.forEach((point,anchorIndex)=>{
    const pulse=.025+.015*Math.sin(time*.65+index+anchorIndex*.7);
    ctx.fillStyle=light?`rgba(126,132,140,${pulse+strength*.47})`:`rgba(157,196,225,${pulse+strength*.35})`;
    ctx.beginPath();ctx.arc(point.x,point.y,1.45+strength*.65,0,Math.PI*2);ctx.fill();
   });
   if(strength<.01||!logoContours.length)return;
   const logoSize=52;
   const logoX=Math.max(32,Math.min(width-32,pointer.x));
   const logoY=Math.max(32,Math.min(height-32,pointer.y));
   const formation=strength*strength*(3-2*strength);
   const visibleAnchors=group.anchors;
   if(!visibleAnchors.length)return;
   logoContours.forEach((contour,contourIndex)=>{
    const assembled=contour.map((point,index)=>{
     const anchor=visibleAnchors[Math.min(visibleAnchors.length-1,Math.floor(index/contour.length*visibleAnchors.length))];
     return{x:anchor.x+(logoX+point.x*logoSize-anchor.x)*formation,y:anchor.y+(logoY+point.y*logoSize-anchor.y)*formation};
    });
    ctx.strokeStyle=light?`rgba(126,132,140,${strength*strength*.48})`:`rgba(163,198,225,${strength*strength*.20})`;ctx.lineWidth=light?.7:.55;
    ctx.beginPath();
    assembled.forEach((point,index)=>{const next=assembled[(index+1)%assembled.length];if(index===0)ctx.moveTo((point.x+next.x)/2,(point.y+next.y)/2);else ctx.quadraticCurveTo(point.x,point.y,(point.x+next.x)/2,(point.y+next.y)/2);});
    ctx.closePath();ctx.stroke();
    assembled.forEach((point,index)=>{
     if(index%18!==0)return;
     ctx.fillStyle=light?`rgba(126,132,140,${strength*strength*.42})`:`rgba(177,207,232,${strength*strength*.22})`;ctx.beginPath();ctx.arc(point.x,point.y,.5,0,Math.PI*2);ctx.fill();
    });
    if(contourIndex===0)visibleAnchors.forEach((anchor,index)=>{
     const destination={x:anchor.x+(logoX-anchor.x)*formation,y:anchor.y+(logoY-anchor.y)*formation};
     const alpha=strength*(1-strength*.35)*(light?.45:.26);
     const color=light?'126,132,140':'133,180,218';
     const control={x:anchor.x+(destination.x-anchor.x)*.55,y:anchor.y+(destination.y-anchor.y)*.45};
     ctx.strokeStyle=`rgba(${color},${alpha})`;ctx.lineWidth=.8;
     ctx.beginPath();ctx.moveTo(anchor.x,anchor.y);ctx.quadraticCurveTo(control.x,control.y,destination.x,destination.y);ctx.stroke();
     const marks=rulerMarks(anchor,control,destination);
     for(const major of [false,true]){
      ctx.strokeStyle=`rgba(${color},${alpha*(major?.95:.8)})`;ctx.lineWidth=major?.75:.6;ctx.beginPath();
      marks.forEach(mark=>{if(mark.major!==major)return;ctx.moveTo(mark.x,mark.y);ctx.lineTo(mark.endX,mark.endY);});ctx.stroke();
     }
    });
   });
  });
 }
 function tick(now){
  frame=0;if(paused||!visible||document.hidden){last=0;return;}
  const delta=last?Math.min((now-last)/1000,.1):1/60;last=now;time+=delta;
  const ease=1-Math.exp(-delta*7);
  pointer.x+=(pointer.targetX-pointer.x)*ease;pointer.y+=(pointer.targetY-pointer.y)*ease;
  const selected=nearbyGroup();
  strengths.forEach((value,index)=>{const target=index===selected?1:0;strengths[index]+=(target-value)*(1-Math.exp(-delta*(target?4.2:3)));});
  draw();frame=requestAnimationFrame(tick);
 }
 function sync(){
  if(frame)cancelAnimationFrame(frame);frame=0;last=0;
  if(paused){strengths.fill(0);pointer.active=false;}draw();
  if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);
 }
 document.addEventListener('pointermove',event=>{
  if(event.pointerType!=='mouse'||paused||!visible)return;
  const rect=canvas.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom){pointer.active=false;return;}
  pointer.targetX=event.clientX-rect.left;pointer.targetY=event.clientY-rect.top;
  if(!pointer.active){pointer.x=pointer.targetX;pointer.y=pointer.targetY;}
  pointer.active=!event.target.closest('a,button,input,select,textarea,summary,.system-diagram,.workflow-panel');
 },{passive:true});
 document.addEventListener('pointerleave',()=>{pointer.active=false;},{passive:true});
 window.addEventListener('scroll',()=>{pointer.active=false;},{passive:true});
 reduced.addEventListener('change',event=>{paused=event.matches;sync();});
 document.addEventListener('visibilitychange',sync);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)pointer.active=false;sync();}).observe(hero);
 new ResizeObserver(resize).observe(hero);
 resize();sync();
 });
})();
