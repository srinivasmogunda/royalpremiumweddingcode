const $=s=>document.querySelector(s);
let password='',current={events:[],gallery:[],sectionVisibility:{}};let initialized=true;let localMode=false;
const fields=['partnerOne','partnerTwo','partnerOneFull','partnerTwoFull','weddingDate','weddingTime','displayDate','intro','hashtag','coverPhoto','entryBackground','heroBackground','eventsBackground','footerBackground','partnerOneParents','partnerTwoParents','partnerOneParentLabel','partnerTwoParentLabel','partnerOneImage','partnerTwoImage','venueTitle','venueAddress','mapUrl','travelNotes','musicUrl','videoUrl','videoTitle','liveUrl'];
const visibilityKeys=['showHero','showCouple','showCountdown','showEvents','showGallery','showVideo','showVenue','showLivestream','showRsvp','showShare','showMusic'];
const visibilityLabels={showHero:'Hero section',showCouple:'The Couple',showCountdown:'Countdown',showEvents:'Events',showGallery:'Gallery',showVideo:'Video',showVenue:'Venue',showLivestream:'Live stream',showRsvp:'RSVP',showShare:'Share',showMusic:'Music control'};
function status(m){$('#save-status').textContent=m}
function headers(json=false){return {'x-admin-password':password,...(json?{'content-type':'application/json'}:{})}}
async function request(path,options={}){const response=await fetch(path,{...options,headers:{...headers(Boolean(options.body)&&!(options.body instanceof Blob)),...(options.headers||{})}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Something went wrong.');return data}
async function checkStatus(){try{const data=await fetch('/api/admin/status').then(r=>{if(!r.ok)throw new Error();return r.json()});initialized=data.initialized;$('#login-title').textContent=initialized?'Open admin':'Create admin password';$('#login-copy').textContent=initialized?'Enter your admin password.':'Choose a private password with at least 8 characters.';$('#login-button').textContent=initialized?'Open editor':'Create password & open'}catch{localMode=true;$('#login-title').textContent='Local editor';$('#login-copy').textContent='Static / Live Server mode. Changes are saved in this browser only.';$('#login-button').textContent='Open local editor';}}
async function login(){password=$('#password').value;if(!localMode&&password.length<8){$('#login-status').textContent='Use at least 8 characters.';return}$('#login-status').textContent='Opening…';try{if(localMode){const stored=localStorage.getItem('weddingConfig');current=stored?JSON.parse(stored):await fetch('./data/config.json',{cache:'no-store'}).then(r=>r.json());fill();renderRsvps([]);$('#login-panel').hidden=true;$('#editor').hidden=false;$('#sign-out').hidden=false;status('Local mode — saved in this browser');return}if(!initialized)await request('/api/admin/setup',{method:'POST',body:JSON.stringify({password}),headers:{'content-type':'application/json'}});const data=await request('/api/admin/config');current=data.config;fill();renderRsvps(data.rsvps);$('#login-panel').hidden=true;$('#editor').hidden=false;$('#sign-out').hidden=false;status('Ready — changes are not published until Save')}catch(e){$('#login-status').textContent=e.message}}
function isoLocalInput(iso){
  if(!iso)return '';
  const d=new Date(iso);
  if(Number.isNaN(d.getTime()))return String(iso).slice(0,16);
  const pad=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function displayDateFromWedding(value){
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return '';
  return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(d);
}
function fill(){
  for(const field of fields){
    const el=$('#content-form').elements[field];
    if(!el)continue;
    if(field==='weddingDate') el.value=isoLocalInput(current[field]);
    else el.value=Array.isArray(current[field])?current[field].join('\n'):(current[field]??'');
  }
  renderEvents();renderGallery();renderVisibility();previewMusic();previewBackgrounds();
}
function renderVisibility(){const root=$('#visibility-editor');root.replaceChildren(...visibilityKeys.map(key=>{const l=document.createElement('label');l.className='visibility-row';const c=document.createElement('input');c.type='checkbox';c.checked=current.sectionVisibility?.[key]!==false;c.dataset.visibility=key;l.append(c,document.createTextNode(visibilityLabels[key]));return l}))}
function renderEvents(){const root=$('#events-editor');root.replaceChildren(...(current.events||[]).map((event,index)=>{const node=$('#event-template').content.firstElementChild.cloneNode(true);node.querySelector('legend').textContent=`Event ${index+1}`;node.querySelectorAll('[data-key]').forEach(input=>input.value=event[input.dataset.key]||'');node.querySelector('.remove-event').onclick=()=>{current.events.splice(index,1);renderEvents();status('Unsaved changes')};node.querySelector('.event-file').onchange=async e=>{if(!e.target.files[0])return;try{event.image=await upload(e.target.files[0],'image');renderEvents()}catch(err){status(err.message)}};return node}))}
function readEvents(){return [...document.querySelectorAll('.event-editor')].map((node,index)=>{const base=current.events[index]||{};node.querySelectorAll('[data-key]').forEach(input=>base[input.dataset.key]=input.value.trim());return base}).filter(x=>x.name)}
function renderGallery(){const root=$('#gallery-editor');root.replaceChildren(...(current.gallery||[]).map((image,index)=>{const item=document.createElement('div');item.className='gallery-thumb';const img=document.createElement('img');img.src=image;img.alt=`Gallery image ${index+1}`;const b=document.createElement('button');b.type='button';b.textContent='×';b.onclick=()=>{current.gallery.splice(index,1);renderGallery();status('Unsaved changes')};item.append(img,b);return item}))}
async function upload(file){status(`${localMode?'Reading':'Uploading'} ${file.name}…`);if(localMode)return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Could not read file.'));r.readAsDataURL(file)});const res=await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`,{method:'PUT',headers:{...headers(),'content-type':file.type||'application/octet-stream'},body:file});const data=await res.json();if(!res.ok)throw new Error(data.error||'Upload failed.');return data.url}
function previewMusic(){const a=$('#music-preview'),src=$('#content-form').elements.musicUrl.value.trim();a.hidden=!src;if(src)a.src=src;else a.removeAttribute('src')}
function previewBackgrounds(){
  for(const key of ['entryBackground','heroBackground','eventsBackground','footerBackground']){
    const input=$('#content-form').elements[key];
    const preview=$(`#${key.replace('Background','-bg-preview')}`);
    if(!input||!preview)continue;
    const src=input.value.trim();
    preview.src=src;
    preview.hidden=!src;
  }
}
function collect(){
  const form=$('#content-form');
  for(const field of fields){
    const el=form.elements[field];if(!el)continue;
    if(field==='travelNotes') current[field]=el.value.split('\n').map(x=>x.trim()).filter(Boolean);
    else if(field==='weddingDate') current[field]=el.value?new Date(el.value).toISOString():'';
    else current[field]=el.value.trim();
  }
  if(current.weddingDate){
    const autoDate=displayDateFromWedding(current.weddingDate);
    if(autoDate) current.displayDate=autoDate;
  }
  current.events=readEvents();current.sectionVisibility=current.sectionVisibility||{};
  for(const key of visibilityKeys){const el=document.querySelector(`[data-visibility="${key}"]`);if(el)current.sectionVisibility[key]=el.checked}
  return current
}
async function save(){status(localMode?'Saving locally…':'Saving…');try{current=collect();if(localMode){localStorage.setItem('weddingConfig',JSON.stringify(current));status('Saved locally — reload invitation to preview');return}const data=await request('/api/admin/config',{method:'POST',body:JSON.stringify({config:current})});current=data.config;status('Saved — public invitation updated')}catch(e){status(e.message)}}
function renderRsvps(items=[]){const root=$('#rsvp-list');if(!items.length){root.textContent='No replies yet.';return}root.replaceChildren(...items.map(reply=>{const article=document.createElement('article');article.className='reply';const b=document.createElement('b');b.textContent=reply.name||'Guest';const p=document.createElement('p');p.textContent=`${reply.attendance==='yes'?'Attending':'Not attending'} · ${reply.guests||1} guest(s)\n${reply.message||''}\n${reply.createdAt?new Date(reply.createdAt).toLocaleString():''}`;article.append(b,p);return article}))}
$('#login-button').onclick=login;$('#password').onkeydown=e=>{if(e.key==='Enter')login()};$('#sign-out').onclick=()=>location.reload();$('#save-top').onclick=save;$('#content-form').onsubmit=e=>{e.preventDefault();save()};$('#content-form').oninput=()=>status('Unsaved changes');$('#content-form').elements.musicUrl.onchange=previewMusic;
$('#content-form').elements.weddingDate.oninput=e=>{const label=displayDateFromWedding(e.target.value);if(label)$('#content-form').elements.displayDate.value=label;status('Wedding date changed — save changes')};
for(const key of ['entryBackground','heroBackground','eventsBackground','footerBackground']){$('#content-form').elements[key].oninput=previewBackgrounds;}
$('#add-event').onclick=()=>{current.events=readEvents();current.events.push({name:'',type:'other',date:'',time:'',venue:'',mapLink:'',description:'',dressCodeText:''});renderEvents();status('Unsaved changes')};
$('#cover-file').onchange=async e=>{if(e.target.files[0]){$('#content-form').elements.coverPhoto.value=await upload(e.target.files[0]);previewBackgrounds();status('Cover upload ready — save changes')}};
for(const [key,id,label] of [['entryBackground','entry-bg-file','Opening background'],['heroBackground','hero-bg-file','Hero background'],['eventsBackground','events-bg-file','Events background'],['footerBackground','footer-bg-file','Footer background']]){
  $(`#${id}`).onchange=async e=>{if(e.target.files[0]){$('#content-form').elements[key].value=await upload(e.target.files[0]);previewBackgrounds();status(`${label} upload ready — save changes`)}};
}
$('#partner-one-file').onchange=async e=>{if(e.target.files[0]){$('#content-form').elements.partnerOneImage.value=await upload(e.target.files[0]);status('Portrait upload ready — save changes')}};
$('#partner-two-file').onchange=async e=>{if(e.target.files[0]){$('#content-form').elements.partnerTwoImage.value=await upload(e.target.files[0]);status('Portrait upload ready — save changes')}};
$('#gallery-files').onchange=async e=>{for(const f of e.target.files)current.gallery.push(await upload(f));renderGallery();status('Gallery uploads ready — save changes')};
$('#music-file').onchange=async e=>{if(e.target.files[0]){$('#content-form').elements.musicUrl.value=await upload(e.target.files[0]);previewMusic();status('Music upload ready — save changes')}};
$('#refresh-rsvps').onclick=async()=>{try{renderRsvps((await request('/api/admin/rsvps')).rsvps)}catch(e){status(e.message)}};
checkStatus();
