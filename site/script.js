'use strict';
const FORM_ENDPOINT = 'https://formspree.io/f/mljgbndd';
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu(){navigation.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('is-open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
const workflow = {
 configure:{state:'PRODUCT CONFIGURATION',title:'Make the choices fit together.',description:'Choose the base equipment and its accessories. Configuration rules help distinguish what is required, recommended or incompatible.',rows:[['Base product','Belt conveyor'],['Accessory','Stainless steel feet'],['Compatibility','Food-grade belt required']]},
 price:{state:'COMMERCIAL CALCULATION',title:'Understand the room to negotiate.',description:'See prices, costs and margins together. The pricing engine explains the calculation and the limits set by commercial policy.',rows:[['Price','Calculated from the selected lines'],['Discount','Checked against applicable limits'],['Margin','Visible to the commercial team']]},
 quote:{state:'PROPOSAL WORKFLOW',title:'Present clearly. Revise with context.',description:'Move the offer through the required approval and presentation steps. A presented revision remains read-only; the next revision continues the conversation.',rows:[['Prepare','Structure the offer'],['Approve','Follow the applicable policy'],['Present & revise','Preserve the presented revision']]}
};
const tabs=Array.from(document.querySelectorAll('[data-step]'));
function selectStep(tab){const step=workflow[tab.dataset.step];tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});document.getElementById('workflow-panel').setAttribute('aria-labelledby',tab.id);document.getElementById('workflow-state').textContent=step.state;document.getElementById('workflow-detail-title').textContent=step.title;document.getElementById('workflow-detail-text').textContent=step.description;const example=document.getElementById('workflow-example');example.replaceChildren();step.rows.forEach((row,index)=>{const div=document.createElement('div');div.className='example-row';const label=document.createElement('span');label.textContent=row[0];const value=document.createElement('strong');value.textContent=row[1];if(index===2)value.className='teal-text';div.append(label,value);example.append(div);});}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectStep(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();selectStep(tabs[next]);tabs[next].focus();});});
const form=document.getElementById('contact-form');
const submitButton=form.querySelector('[type=submit]');
const status=document.getElementById('form-status');
const required=['name','email','message'];
let sending=false;
function value(name){return form.elements.namedItem(name).value.trim();}
function valid(name){const field=form.elements.namedItem(name);return value(name).length>0&&field.checkValidity();}
function mark(name,isValid){const field=form.elements.namedItem(name);field.setAttribute('aria-invalid',String(!isValid));document.getElementById(name+'-error').hidden=isValid;}
function say(text,state){status.textContent=text;status.dataset.state=state;}
required.forEach(name=>form.elements.namedItem(name).addEventListener('input',()=>{if(form.elements.namedItem(name).getAttribute('aria-invalid')==='true')mark(name,valid(name));}));
form.addEventListener('submit',async event=>{
 event.preventDefault();if(sending)return;
 const invalid=required.filter(name=>!valid(name));required.forEach(name=>mark(name,!invalid.includes(name)));
 if(invalid.length){say('Please check the highlighted fields.','error');form.elements.namedItem(invalid[0]).focus();return;}
 if(value('_gotcha')){say('The request could not be sent. Please reload the page and try again.','error');return;}
 const payload={name:value('name'),email:value('email'),company:value('company'),topic:value('topic'),message:value('message'),_gotcha:'',_subject:'Enquiry from the LinkPort Systems website'};
 sending=true;submitButton.disabled=true;form.setAttribute('aria-busy','true');say('Sending your enquiry…','sending');
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(FORM_ENDPOINT,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit',cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('Delivery failed');form.reset();required.forEach(name=>mark(name,true));say('Thank you. Your enquiry has been sent. We will reply by email.','success');}
 catch{say('Your enquiry could not be sent. Your message is still here; please try again later.','error');}
 finally{clearTimeout(timeout);sending=false;submitButton.disabled=false;form.removeAttribute('aria-busy');}
});
document.getElementById('year').textContent=String(new Date().getFullYear());

// Privacy links open their content as well as navigating to the section.
const privacyDetails=document.querySelector('#privacy details');
function revealPrivacy(){if(location.hash==='#privacy')privacyDetails.open=true;}
document.querySelectorAll('a[href="#privacy"]').forEach(link=>link.addEventListener('click',()=>{privacyDetails.open=true;}));
window.addEventListener('hashchange',revealPrivacy);
revealPrivacy();

