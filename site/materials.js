
'use strict';
// Edge-only material treatment never covers content or intercepts the mouse.
document.querySelectorAll('.product-intro,.company,.capabilities,.ai-support,.workflow,.fit,.faq,.contact,.privacy').forEach(section=>{
 const layer=document.createElement('div');layer.className='material-glass';layer.setAttribute('aria-hidden','true');section.prepend(layer);
 const edge=document.createElement('div');edge.className='material-edge glass-edge';edge.setAttribute('aria-hidden','true');section.append(edge);
});
document.querySelectorAll('.hero,.approach,.site-footer').forEach(section=>{
 const edge=document.createElement('div');edge.className='material-edge steel-edge';edge.setAttribute('aria-hidden','true');section.append(edge);
});
