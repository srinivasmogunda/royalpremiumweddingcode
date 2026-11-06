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
// Copy what is typed in the editor back into current.events before the list is
// re-rendered. Unlike readEvents() it keeps unnamed rows, so the indices the
// buttons act on still line up — and edits not yet saved are not thrown away
// when an event is removed or moved.
function syncEvents(){
  document.querySelectorAll('.event-editor').forEach((node,index)=>{
    const event=current.events[index];
    if(!event) return;
    node.querySelectorAll('[data-key]').forEach(input=>event[input.dataset.key]=input.value.trim());
  });
}
// The invitation lists events in exactly this order, so the editor has to be
// able to change it; before, the only way was to delete and re-enter events.
function moveEvent(index,delta){
  syncEvents();
  const target=index+delta;
  if(target<0 || target>=current.events.length) return;
  [current.events[index],current.events[target]]=[current.events[target],current.events[index]];
  renderEvents();
  status('Event order changed — save changes');
  // Keep the moved event in view rather than leaving it scrolled off.
  document.querySelectorAll('.event-editor')[target]?.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function renderEvents(){
  const root=$('#events-editor');
  const events=current.events||[];
  root.replaceChildren(...events.map((event,index)=>{
    const node=$('#event-template').content.firstElementChild.cloneNode(true);
    node.querySelector('legend').textContent=`Event ${index+1}`;
    node.querySelectorAll('[data-key]').forEach(input=>input.value=event[input.dataset.key]||'');
    const up=node.querySelector('.move-up'), down=node.querySelector('.move-down');
    up.disabled=index===0;
    down.disabled=index===events.length-1;
    up.onclick=()=>moveEvent(index,-1);
    down.onclick=()=>moveEvent(index,1);
    node.querySelector('.remove-event').onclick=()=>{syncEvents();current.events.splice(index,1);renderEvents();status('Unsaved changes')};
    node.querySelector('.event-file').onchange=e=>handleFiles(e.target,`Event ${index+1} image`,async file=>{syncEvents();event.image=await upload(file);renderEvents()});
    return node;
  }));
}
function readEvents(){return [...document.querySelectorAll('.event-editor')].map((node,index)=>{const base=current.events[index]||{};node.querySelectorAll('[data-key]').forEach(input=>base[input.dataset.key]=input.value.trim());return base}).filter(x=>x.name)}
function renderGallery(){const root=$('#gallery-editor');root.replaceChildren(...(current.gallery||[]).map((image,index)=>{const item=document.createElement('div');item.className='gallery-thumb';const img=document.createElement('img');img.src=image;img.alt=`Gallery image ${index+1}`;const b=document.createElement('button');b.type='button';b.textContent='×';b.onclick=()=>{current.gallery.splice(index,1);renderGallery();status('Unsaved changes')};item.append(img,b);return item}))}
// Phone photos run 3–12 MB, and the hosted upload endpoint rejects request
// bodies past roughly 4.5 MB of binary — which is why picking a photo used to
// do nothing at all. Downscale in the browser first so every upload fits, and
// so guests are not made to download a 12 MB image.
const MAX_IMAGE_EDGE=1920;
const MAX_UPLOAD_BYTES=3.5*1024*1024;
const MAX_LOCAL_BYTES=420*1024;      // a data URL this size still fits localStorage
const MAX_OTHER_BYTES=3.5*1024*1024; // audio and anything else we cannot shrink

function readImage(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error(`${file.name} is not an image this browser can read.`))};
    img.src=url;
  });
}
function canvasToBlob(canvas,type,quality){
  return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not compress the image.')),type,quality));
}
async function shrinkImage(file,maxBytes){
  if(!file.type.startsWith('image/')||file.type==='image/svg+xml')return file;
  const img=await readImage(file);
  const scale=Math.min(1,MAX_IMAGE_EDGE/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
  const ctx=canvas.getContext('2d');
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  let blob=null;
  for(const quality of [0.85,0.75,0.65,0.55,0.45]){
    blob=await canvasToBlob(canvas,'image/jpeg',quality);
    if(blob.size<=maxBytes)break;
  }
  // Still too heavy at the lowest quality: halve the pixels and try once more.
  if(blob.size>maxBytes){
    canvas.width=Math.max(1,Math.round(canvas.width/2));
    canvas.height=Math.max(1,Math.round(canvas.height/2));
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    blob=await canvasToBlob(canvas,'image/jpeg',0.72);
  }
  if(blob.size>=file.size)return file; // already smaller than anything we produce
  const name=file.name.replace(/\.[^.]+$/,'')+'.jpg';
  return new File([blob],name,{type:'image/jpeg'});
}
function readAsDataUrl(file){
  return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('Could not read file.'));r.readAsDataURL(file)});
}
async function upload(file){
  const isImage=file.type.startsWith('image/');
  status(`${localMode?'Reading':'Uploading'} ${file.name}…`);
  let payload=file;
  if(isImage){
    payload=await shrinkImage(file,localMode?MAX_LOCAL_BYTES:MAX_UPLOAD_BYTES);
    if(payload!==file) status(`${localMode?'Reading':'Uploading'} ${file.name} (${Math.round(payload.size/1024)} KB after resizing)…`);
  }
  const limit=isImage?(localMode?MAX_LOCAL_BYTES:MAX_UPLOAD_BYTES):MAX_OTHER_BYTES;
  if(payload.size>limit){
    throw new Error(`${file.name} is ${Math.round(payload.size/1024/1024*10)/10} MB after compression — the limit is ${Math.round(limit/1024/1024*10)/10} MB. Host it elsewhere and paste its URL instead.`);
  }
  if(localMode) return await readAsDataUrl(payload);
  const res=await fetch(`/api/admin/upload?name=${encodeURIComponent(payload.name)}`,{method:'PUT',headers:{...headers(),'content-type':payload.type||'application/octet-stream'},body:payload});
  // A platform-level rejection (413, gateway error) returns HTML, not JSON.
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw new Error(data.error||`Upload failed (${res.status} ${res.statusText||''}).`.trim());
  if(!data.url)throw new Error('Upload succeeded but returned no URL.');
  return data.url;
}
// Every file input goes through this, so a failed upload always says why
// instead of rejecting silently, and re-picking the same file still fires.
async function handleFiles(input,label,handler){
  const files=[...input.files];
  if(!files.length)return;
  try{
    for(const file of files) await handler(file);
    status(`${label} ready — save changes`);
  }catch(error){
    console.error(error);
    status(`${label} failed: ${error.message}`);
  }finally{
    input.value='';
  }
}
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
async function save(){status(localMode?'Saving locally…':'Saving…');try{current=collect();if(localMode){try{localStorage.setItem('weddingConfig',JSON.stringify(current))}catch(e){throw new Error('This browser ran out of local storage — local mode keeps photos inside the page itself. Run the site with "node server/index.js" so uploads are stored as files, or paste hosted photo URLs instead.')}status('Saved locally — reload invitation to preview');return}const data=await request('/api/admin/config',{method:'POST',body:JSON.stringify({config:current})});current=data.config;status('Saved — public invitation updated')}catch(e){status(e.message)}}
// Guests pick a head count and the ceremonies they are coming to; show both,
// and a running total, so the list is usable for catering and seating.
function partyLine(reply){
  const adults=Number(reply.adults), children=Number(reply.children);
  if(Number.isFinite(adults)&&adults>0){
    const parts=[`${adults} adult${adults===1?'':'s'}`];
    if(Number.isFinite(children)&&children>0) parts.push(`${children} child${children===1?'':'ren'}`);
    return parts.join(' + ');
  }
  const guests=Number(reply.guests)||1;
  return `${guests} guest${guests===1?'':'s'}`;
}
function renderRsvps(items=[]){
  const root=$('#rsvp-list');
  if(!items.length){root.textContent='No replies yet.';return}
  const attending=items.filter(r=>r.attendance!=='no');
  const headcount=attending.reduce((sum,r)=>sum+(Number(r.guests)||Number(r.adults)+Number(r.children)||1),0);
  const summary=document.createElement('p');
  summary.className='reply-summary';
  summary.textContent=`${items.length} repl${items.length===1?'y':'ies'} · ${attending.length} attending · ${headcount} guest${headcount===1?'':'s'} expected`;
  root.replaceChildren(summary,...items.map(reply=>{
    const article=document.createElement('article');
    article.className='reply';
    const b=document.createElement('b');
    b.textContent=reply.name||'Guest';
    const p=document.createElement('p');
    const lines=[`${reply.attendance==='yes'?'Attending':'Not attending'} · ${partyLine(reply)}`];
    if(Array.isArray(reply.events)&&reply.events.length) lines.push(`Events: ${reply.events.join(', ')}`);
    if(reply.message) lines.push(reply.message);
    if(reply.createdAt) lines.push(new Date(reply.createdAt).toLocaleString());
    p.textContent=lines.join('\n');
    article.append(b,p);
    return article;
  }));
}
$('#login-button').onclick=login;$('#password').onkeydown=e=>{if(e.key==='Enter')login()};$('#sign-out').onclick=()=>location.reload();$('#save-top').onclick=save;$('#content-form').onsubmit=e=>{e.preventDefault();save()};$('#content-form').oninput=()=>status('Unsaved changes');$('#content-form').elements.musicUrl.onchange=previewMusic;
$('#content-form').elements.weddingDate.oninput=e=>{const label=displayDateFromWedding(e.target.value);if(label)$('#content-form').elements.displayDate.value=label;status('Wedding date changed — save changes')};
for(const key of ['entryBackground','heroBackground','eventsBackground','footerBackground']){$('#content-form').elements[key].oninput=previewBackgrounds;}
$('#add-event').onclick=()=>{current.events=readEvents();current.events.push({name:'',type:'other',date:'',time:'',venue:'',mapLink:'',description:'',dressCodeText:''});renderEvents();status('Unsaved changes')};
for(const [key,id,label] of [
  ['coverPhoto','cover-file','Cover photo'],
  ['entryBackground','entry-bg-file','Opening background'],
  ['heroBackground','hero-bg-file','Hero background'],
  ['eventsBackground','events-bg-file','Events background'],
  ['footerBackground','footer-bg-file','Footer background'],
]){
  $(`#${id}`).onchange=e=>handleFiles(e.target,label,async file=>{
    $('#content-form').elements[key].value=await upload(file);
    previewBackgrounds();
  });
}
for(const [key,id] of [['partnerOneImage','partner-one-file'],['partnerTwoImage','partner-two-file']]){
  $(`#${id}`).onchange=e=>handleFiles(e.target,'Portrait',async file=>{
    $('#content-form').elements[key].value=await upload(file);
  });
}
$('#gallery-files').onchange=e=>handleFiles(e.target,'Gallery photos',async file=>{
  if(!Array.isArray(current.gallery)) current.gallery=[];
  current.gallery.push(await upload(file));
  renderGallery();
});
$('#music-file').onchange=e=>handleFiles(e.target,'Music',async file=>{
  $('#content-form').elements.musicUrl.value=await upload(file);
  previewMusic();
});
$('#refresh-rsvps').onclick=async()=>{try{renderRsvps((await request('/api/admin/rsvps')).rsvps)}catch(e){status(e.message)}};
checkStatus();
