"use strict";
(function(){
 const root=document.documentElement;
 root.dataset.accent=new URLSearchParams(location.search).get('accent')==='copper'?'copper':'amber';
 if(root.dataset.accent!=='amber')return;
 const links=Array.from(document.querySelectorAll('.site-header nav a[href^="#"]'));
 const targets=links.map(link=>({link,section:document.querySelector(link.getAttribute('href'))})).filter(item=>item.section);
 for(const [href,selector] of [['#quotiflex','.capabilities,.ai-support,.workflow'],['#approach','.fit,.faq']]){
  const link=links.find(item=>item.getAttribute('href')===href);
  if(link)document.querySelectorAll(selector).forEach(section=>targets.push({link,section}));
 }
 let pending=false;
 function update(){
  pending=false;
  const line=Math.min(innerHeight*.35,260);
  let selected=null,nearest=-Infinity;
  targets.forEach(item=>{const top=item.section.getBoundingClientRect().top;if(top<=line&&top>nearest){selected=item;nearest=top;}});
  links.forEach(link=>link.removeAttribute('aria-current'));
  if(selected)selected.link.setAttribute('aria-current','location');
 }
 function request(){if(!pending){pending=true;requestAnimationFrame(update);}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request);addEventListener('hashchange',request);update();
})();
