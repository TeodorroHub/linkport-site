'use strict';
// The product videos (added by tools/build.py, not part of the design folder). A video is a link
// to YouTube with our own poster. Pressing it puts YouTube's privacy-enhanced player
// (youtube-nocookie.com) in its place and starts the video; before that, nothing is requested
// from YouTube. Without script the link opens YouTube.
// One player and a list: choosing a video in the list puts it in the player and starts it, and
// the address gets the video's anchor (#video-...), so a link with that anchor opens the page
// with that video in the player. The anchors sit at the top of the player, so the browser
// scrolls a link with one to the player by itself.
(()=>{
 let playing=null;
 const stop=()=>{if(playing)playing.frame.replaceWith(playing.poster);playing=null;};
 const play=poster=>{
  const id=poster.dataset.youtube;
  if(!/^[A-Za-z0-9_-]{11}$/.test(id))return false;
  const frame=document.createElement('div');frame.className='video-frame';
  const player=document.createElement('iframe');
  player.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
  player.title=poster.getAttribute('aria-label').replace(/^Přehrát video: /,'');
  player.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.allowFullscreen=true;
  player.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  frame.append(player);stop();poster.replaceWith(frame);playing={frame,poster};player.focus();
  return true;
 };
 const plainClick=event=>!(event.ctrlKey||event.metaKey||event.shiftKey||event.button!==0);
 document.querySelectorAll('a.video-poster[data-youtube]').forEach(poster=>{
  poster.addEventListener('click',event=>{if(plainClick(event)&&play(poster))event.preventDefault();});
 });

 const library=document.querySelector('[data-video-library]');
 if(!library)return;
 const poster=library.querySelector('.video-poster');
 const items=[...library.querySelectorAll('.video-item')];
 const field=name=>library.querySelector(`[data-video-${name}]`);
 const select=item=>{
  stop();
  items.forEach(other=>other.toggleAttribute('aria-current',other===item));
  item.setAttribute('aria-current','true');
  const title=item.querySelector('.video-item-title').textContent;
  const base=item.dataset.poster;
  const img=poster.querySelector('img');
  poster.href=item.href;poster.dataset.youtube=item.dataset.youtube;
  poster.setAttribute('aria-label',`Přehrát video: ${title.replace(/\.$/,'')}, ${item.dataset.lengthLabel}`);
  img.srcset=`${base}-640.webp 640w, ${base}-1280.webp 1280w, ${base}-1920.webp 1920w`;img.src=`${base}-1280.webp`;
  poster.querySelector('.video-time').textContent=item.dataset.length;
  field('topic').textContent=item.querySelector('.video-item-topic').textContent;
  field('title').textContent=title;
  field('desc').textContent=item.dataset.desc;
  field('watch').href=item.href;
 };
 const showPlayer=()=>{
  const top=library.getBoundingClientRect().top;
  if(top<0||top>innerHeight/3){
   const smooth=!matchMedia('(prefers-reduced-motion: reduce)').matches;
   library.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'});
  }
 };
 items.forEach(item=>item.addEventListener('click',event=>{
  if(!plainClick(event))return;
  event.preventDefault();select(item);history.replaceState(null,'',`#${item.dataset.anchor}`);showPlayer();play(poster);
 }));
 const fromAddress=()=>{
  const item=items.find(candidate=>`#${candidate.dataset.anchor}`===location.hash);
  if(item)select(item);
 };
 fromAddress();
 addEventListener('hashchange',fromAddress);
})();
