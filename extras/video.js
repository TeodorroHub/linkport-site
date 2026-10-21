'use strict';
// The product video (added by tools/build.py, not part of the design folder). A video is a link
// to YouTube with our own poster. Pressing it puts YouTube's privacy-enhanced player
// (youtube-nocookie.com) in its place and starts the video; before that, nothing is requested
// from YouTube. Without script the link opens YouTube.
document.querySelectorAll('a.video-poster[data-youtube]').forEach(poster=>{
 poster.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.button!==0)return;
  const id=poster.dataset.youtube;
  if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  event.preventDefault();
  const frame=document.createElement('div');frame.className='video-frame';
  const player=document.createElement('iframe');
  player.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
  player.title=poster.getAttribute('aria-label').replace(/^Play the video: /,'');
  player.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.allowFullscreen=true;
  player.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
  frame.append(player);poster.replaceWith(frame);player.focus();
 });
});
