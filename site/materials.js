
'use strict';
// Edge-only material treatment never covers content or intercepts the mouse.
const glassSurfaces=[];
function glassRing(){const ring=document.createElement('div');ring.className='glass-hover-ring';ring.setAttribute('aria-hidden','true');return ring;}
document.querySelectorAll('.product-intro,.company,.capabilities,.ai-support,.workflow,.fit,.faq,.contact,.privacy').forEach(section=>{
 const layer=document.createElement('div');layer.className='material-glass';layer.setAttribute('aria-hidden','true');section.prepend(layer);
 const edge=document.createElement('div');edge.className='material-edge glass-edge';edge.setAttribute('aria-hidden','true');edge.append(glassRing());section.append(edge);glassSurfaces.push({surface:section,edge});
});
document.querySelectorAll('.hero,.approach,.site-footer').forEach(section=>{
 const edge=document.createElement('div');edge.className='material-edge steel-edge';edge.setAttribute('aria-hidden','true');section.append(edge);
});

// Use the visible full-width panel bounds, including margins outside .shell.
document.querySelectorAll('.system-diagram').forEach(surface=>{surface.append(glassRing());glassSurfaces.push({surface,edge:surface});});
const glassPointer={x:0,y:0,active:false};
const glassHover=matchMedia('(hover:hover) and (pointer:fine)');
let glassFrame=0;
function updateGlassHover(){
 glassFrame=0;
 const header=document.querySelector('.site-header');
 const belowHeader=!header||glassPointer.y>=header.getBoundingClientRect().bottom;
 const enabled=glassPointer.active&&belowHeader&&glassHover.matches&&document.documentElement.dataset.accent==='amber';
 let selected=null;
 if(enabled)for(const item of glassSurfaces){
  const box=item.edge.getBoundingClientRect();
  if(glassPointer.x>=box.left&&glassPointer.x<=box.right&&glassPointer.y>=box.top&&glassPointer.y<=box.bottom){selected=item;break;}
 }
 glassSurfaces.forEach(item=>item.surface.classList.toggle('is-glass-lit',item===selected));
}
function requestGlassHover(){if(!glassFrame)glassFrame=requestAnimationFrame(updateGlassHover);}
function clearGlassHover(){glassPointer.active=false;requestGlassHover();}
document.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;glassPointer.x=event.clientX;glassPointer.y=event.clientY;glassPointer.active=true;requestGlassHover();},{passive:true});
document.addEventListener('pointerleave',clearGlassHover);
addEventListener('blur',clearGlassHover);
addEventListener('scroll',requestGlassHover,{passive:true});
addEventListener('resize',requestGlassHover,{passive:true});
glassHover.addEventListener('change',clearGlassHover);
