import gsap from './vendor/gsap/index.js';
import { ScrollTrigger } from './vendor/gsap/ScrollTrigger.js';
import confetti from './vendor/canvas-confetti/confetti.module.mjs';

gsap.registerPlugin(ScrollTrigger);

const LIVE_ASSET = 'https://myshaadhilink.in/assets/royal-premium';
const DEFAULTS = {
  partnerOne: 'Sidharth',
  partnerTwo: 'Kiara',
  partnerOneFull: 'Sidharth',
  partnerTwoFull: 'Kiara Advani',
  displayDate: 'October 12, 2026',
  weddingDate: '2026-10-12T10:30:00+00:00',
  weddingTime: '10:30 AM',
  intro: 'Together with our families, we joyfully invite you to celebrate our union',
  hashtag: '#SidharthKiaraWedding',
  venueTitle: 'Pati Patni Aur Panga',
  venueAddress: 'Pati Patni Aur Panga',
  mapUrl: 'https://maps.app.goo.gl/mBMK1HkkHVTVZ6ET8',
  travelNotes: [
    'Arrive 30 minutes early for welcome rituals',
    'Traditional attire is warmly encouraged',
    'Parking and valet support available on-site',
  ],
  partnerOneParents: 'Khushal Chandwani & Deepa Chandwani',
  partnerTwoParents: 'Sameer Gor and Dr. Chetna Gor.',
  partnerOneParentLabel: 'Son of',
  partnerTwoParentLabel: 'Daughter of',
  partnerOneImage: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/0ad0141c30-711c5d772273c788fdb83a5bfbabd474.jpg',
  partnerTwoImage: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/a9625665de-Kiara-Advani-in-Lehenga-1.jpg',
  coverPhoto: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
  entryBackground: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
  heroBackground: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
  eventsBackground: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
  footerBackground: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
  musicUrl: 'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/ac18142c83-WhatsApp-Audio-2026-08-04-at-7.27.12-PM.mp3',
  videoUrl: 'https://www.youtube.com/watch?v=tyBJioe8gOs',
  videoTitle: 'A Special Glimpse',
  liveUrl: 'https://maps.app.goo.gl/mBMK1HkkHVTVZ6ET8',
  gallery: [
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/d572ace496-1-1.jpg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/f547856b21-1787214206310.jpg.jpeg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/8083516cbe-3-1.jpg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/eb86faca00-1787214322222.jpg-scaled.jpeg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/e6347d1017-6.avif',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/6043e66ab0-1787214550888.jpg.jpeg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/f39b7596e3-9.jpg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/3724a25d98-3.webp',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/afe9dcb3ad-1787214400441.jpg-scaled.jpeg',
    'https://p7fosjg9fjbplnvq.public.blob.vercel-storage.com/synced-media/f23319a646-1787214510228.jpg.jpeg',
  ],
  events: [
    { name: 'Haldi Ceremony', date: 'Saturday, 05 march', time: '9:00 onwards', venue: 'Taj Banjara', mapLink: 'https://www.google.com/maps', type: 'haldi' },
    { name: 'reception', date: 'Saturday, 6th march', time: '12:30', venue: 'Hi! This is Drabad Kukat Pally.', mapLink: 'https://hpanel.hostinger.com/websites', type: 'mehendi' },
    { name: 'Wedding ceremony', date: 'Saturday, 7th march', time: '9:00 pm onwards', venue: 'Kukatpally, Hyderabad.', mapLink: 'https://maps.app.goo.gl/mBMK1HkkHVTVZ6ET8', type: 'wedding' },
    { name: 'sangeeth', date: 'Saturday, 8th march', time: '9:00 00 PM Onwards', venue: 'kukatpally', mapLink: '', type: 'haldi' },
  ],
  sectionVisibility: { showHero:true, showBlessing:true, showCouple:true, showCountdown:true, showEvents:true, showGallery:true, showVenue:true, showLivestream:true, showVideo:true, showRsvp:true, showShare:true, showMusic:true },
};

const state = { config: DEFAULTS, opened: false, audio: null, scrollReady: false };
const root = document.querySelector('#app');
const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const clone = (v) => JSON.parse(JSON.stringify(v));

function asset(name){ return `./assets/royal-premium/${name}`; }
function remoteAsset(name){ return `${LIVE_ASSET}/${name}`; }
function visible(key){ return state.config.sectionVisibility?.[key] !== false; }
function fmtDate(iso, fallback){
  const d = new Date(iso || '');
  if (!Number.isNaN(d.getTime())) return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(d);
  return fallback || 'A Beautiful Day Ahead';
}
function isoLocalInput(iso){
  const d = new Date(iso || ''); if (Number.isNaN(d.getTime())) return '';
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function iconFor(type,name=''){
  const t=(type||'').toLowerCase(), n=name.toLowerCase();
  if(/haldi|turmeric|ubtan/.test(t+' '+n)) return '✺';
  if(/mehndi|mehendi|henna/.test(t+' '+n)) return '❀';
  if(/sangeet|dance|music/.test(t+' '+n)) return '♫';
  if(/reception/.test(t+' '+n)) return '✦';
  if(/wedding|vivah|shaadi|marriage/.test(t+' '+n)) return '◈';
  return '◌';
}

function normalizeConfig(raw){
  const c={...clone(DEFAULTS),...(raw||{})};
  c.entryBackground=c.entryBackground || c.coverPhoto || DEFAULTS.entryBackground;
  c.heroBackground=c.heroBackground || c.coverPhoto || DEFAULTS.heroBackground;
  c.eventsBackground=c.eventsBackground || c.coverPhoto || DEFAULTS.eventsBackground;
  c.footerBackground=c.footerBackground || c.coverPhoto || DEFAULTS.footerBackground;
  return c;
}
async function loadConfig(){
  try{
    const r=await fetch('/api/config',{cache:'no-store'}); if(r.ok) return normalizeConfig(await r.json());
  }catch{}
  const local=localStorage.getItem('weddingConfig');
  if(local){try{return normalizeConfig(JSON.parse(local))}catch{}}
  try{const r=await fetch('./data/config.json',{cache:'no-store'});if(r.ok)return normalizeConfig(await r.json())}catch{}
  return normalizeConfig(DEFAULTS);
}

function renderShell(){
  const c=state.config;
  root.innerHTML=`
    <div class="royal-premium">
      <div aria-hidden="true" class="rp-bloom-petals" id="rp-bloom-petals"></div>
      <div aria-hidden="true" class="rp-rain" id="rp-global-rain"></div>
      <div class="rp-main" id="rp-main">
        ${renderHero(c)}
        ${visible('showCouple') ? renderCouple(c) : ''}
        ${visible('showEvents') ? renderEvents(c) : ''}
        ${visible('showCountdown') ? renderCountdown(c) : ''}
        ${visible('showGallery') ? renderGallery(c) : ''}
        ${visible('showVideo') ? renderVideo(c) : ''}
        ${visible('showVenue') ? renderVenue(c) : ''}
        ${visible('showLivestream') ? renderLive(c) : ''}
        ${visible('showRsvp') ? renderRsvp(c) : ''}
        ${visible('showShare') ? renderShare(c) : ''}
        ${renderFooter(c)}
      </div>
      ${renderEntry(c)}
      ${visible('showMusic') && c.musicUrl ? `<button class="rp-music" id="music-btn" type="button" aria-pressed="false"><span aria-hidden="true" class="rp-music__icon"><i></i><i></i><i></i><i></i></span><span class="rp-music__text rp-font-label">Sound Off</span></button>` : ''}
    </div>`;
}

function renderEntry(c){
  return `<div class="rp-entry" id="rp-entry">
    ${c.entryBackground!==null ? `<img class="rp-entry__photo" src="${esc(c.entryBackground || c.coverPhoto || remoteAsset('ext-couple-hero.jpg'))}" alt="" decoding="async" fetchpriority="high">` : ''}
    <div class="rp-entry__veil"></div>
    <img class="rp-entry__jali" src="${asset('jali-pattern.svg')}" alt="">
    <div class="rp-entry__glow"></div>
    <div class="rp-entry__flash"></div>
    <div class="rp-entry__content">
      <p class="rp-entry__title rp-font-label">The Wedding Celebration</p>
      <img class="rp-entry__mandala" src="${asset('mandala-bloom.svg')}" alt="">
      <h1 class="rp-entry__names rp-font-script"><span class="rp-entry__name">${esc(c.partnerOne)}</span><span class="rp-entry__amp">&amp;</span><span class="rp-entry__name">${esc(c.partnerTwo)}</span></h1>
      <img class="rp-entry__ornament" src="${asset('ornate-divider.svg')}" alt="">
      <button class="rp-entry__cta rp-font-label" id="open-invitation">Open Invitation</button>
    </div>
  </div>`;
}

// A first guess only, so the names do not visibly reflow. fitNames() measures
// the real thing afterwards and corrects it — letter counts cannot predict
// width in a script face, where a swashed "B" is several times an "i".
function nameFitClass(first,second){
  const longest=Math.max(first.length,second.length);
  const combined=first.length+second.length;
  if(longest>11 || combined>19) return ' rp-hero__names--col';
  if(longest>7 || combined>12) return ' rp-hero__names--long';
  return '';
}

// Great Vibes overhangs its glyph boxes, and .rp-hero has overflow:hidden, so
// a name that "just fits" by layout width still loses the tail of its last
// letter. Leave this much room on each side.
const NAME_SWASH_ROOM=18;

// How wide the names actually are. Measured from the children, never from the
// wrapper: these wrappers are block-level flex containers, so their own
// scrollWidth is just the parent's width and would never look like it fits.
// offsetWidth rather than getBoundingClientRect, because the entry names are
// mid-tween when this first runs and a transform would skew the reading.
function nameContentWidth(el,parts,isStacked){
  const widths=parts.map(p=>p.offsetWidth);
  if(isStacked) return Math.max(...widths);
  const gap=parseFloat(getComputedStyle(el).columnGap)||0;
  return widths.reduce((a,b)=>a+b,0)+gap*(parts.length-1);
}

// Shrink `el` until its names clear the container, returning whether they do.
function shrinkNamesToFit(el,container,isStacked,floor){
  const parts=[...el.children];
  if(!parts.length) return true;
  const room=container.clientWidth-NAME_SWASH_ROOM*2;
  const width=()=>nameContentWidth(el,parts,isStacked());
  let scale=1;
  el.style.removeProperty('--rp-name-scale');
  while(scale>floor && width()>room){
    scale-=0.02;
    el.style.setProperty('--rp-name-scale',scale.toFixed(2));
  }
  return width()<=room;
}

function fitNames(){
  const hero=document.querySelector('.rp-hero__names');
  const heroContent=document.querySelector('.rp-hero__content');
  if(hero && heroContent){
    // Shrink smoothly rather than stepping between preset sizes, so the names
    // stay as large as they can while still clearing the edges. Only stack
    // them once side-by-side would have to get genuinely small.
    const stacked=()=>hero.classList.contains('rp-hero__names--col');
    hero.className='rp-hero__names';
    if(!shrinkNamesToFit(hero,heroContent,stacked,0.72)){
      hero.className='rp-hero__names rp-hero__names--col';
      shrinkNamesToFit(hero,heroContent,stacked,0.5);
    }
  }
  // Entry and footer: keep the pair on one line while it fits, otherwise give
  // each name its own line rather than letting the text wrap mid-name.
  for(const [sel,modifier] of [['.rp-entry__names','rp-entry__names--stacked'],['.rp-footer__names','rp-footer__names--stacked']]){
    const el=document.querySelector(sel);
    if(!el || !el.parentElement) continue;
    const stacked=()=>el.classList.contains(modifier);
    el.classList.remove(modifier);
    if(!shrinkNamesToFit(el,el.parentElement,stacked,0.82)){
      el.classList.add(modifier);
      shrinkNamesToFit(el,el.parentElement,stacked,0.5);
    }
  }
}

function renderHero(c){
  const first=c.partnerOne||'Sidharth', second=c.partnerTwo||'Kiara';
  const chars=(s,p)=>[...s].map((ch,i)=>`<span class="rp-hero__char" data-char="${p}-${i}">${ch===' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
  return `<section class="rp-hero rp-section" id="hero">
    ${c.heroBackground ? `<img class="rp-hero__photo" src="${esc(c.heroBackground)}" alt="" decoding="async" fetchpriority="high">` : ''}
    <div class="rp-hero__bg"></div><div class="rp-hero__veil"></div>
    <div class="rp-hero__mandala-bg"><img class="rp-hero__mandala-img" src="${asset('mandala-bloom.svg')}" alt=""></div>
    <img class="rp-hero__jali" src="${asset('jali-pattern.svg')}" alt="">
    <div class="rp-hero__content rp-container">
      <img class="rp-hero__ganesha" src="${remoteAsset('ganesha-header.png')}" alt="">
      <div class="rp-hero__line"></div>
      <p class="rp-hero__label rp-font-label">Wedding Celebration</p>
      <div class="rp-hero__names${nameFitClass(first,second)}">
        <h1 class="rp-hero__name rp-font-script">${chars(first,'g')}</h1>
        <span class="rp-hero__amp">&amp;</span>
        <h1 class="rp-hero__name rp-font-script">${chars(second,'b')}</h1>
      </div>
      <div class="rp-hero__line"></div>
      <span class="rp-chip rp-hero__chip rp-font-label">${esc(fmtDate(c.weddingDate,c.displayDate))}&nbsp;•&nbsp;${esc(c.weddingTime||'7:00 PM onwards')}</span>
      <p class="rp-hero__welcome rp-font-serif">${esc(c.intro || 'Together with our families, we joyfully invite you to celebrate our union')}</p>
      <img src="${asset('ornate-divider.svg')}" class="rp-hero__ornament" alt="">
      <div class="rp-hero__scroll rp-font-label"><span class="rp-hero__scroll-arrow">↓</span><span>Scroll to Explore</span></div>
    </div>
  </section>`;
}

function renderCouple(c){
  const people=[
    {photo:c.partnerOneImage,name:c.partnerOneFull||c.partnerOne,parentLabel:c.partnerOneParentLabel||'Son of',parents:c.partnerOneParents},
    {photo:c.partnerTwoImage,name:c.partnerTwoFull||c.partnerTwo,parentLabel:c.partnerTwoParentLabel||'Daughter of',parents:c.partnerTwoParents},
  ];
  return `<section class="rp-couple rp-section" id="couple"><div class="rp-container">
    <img src="${asset('ornate-divider.svg')}" alt="" class="rp-couple__divider">
    <h2 class="rp-couple__heading rp-font-heading">The Couple</h2>
    <p class="rp-couple__sub rp-font-serif">Two families, many traditions, one timeless celebration.</p>
    <div class="rp-couple__grid">${people.map(p=>`<article class="rp-couple__card">
      <div class="rp-couple__photo-wrap"><img src="${asset('arch-gold.svg')}" alt="" class="rp-couple__arch"><img src="${esc(p.photo)}" alt="${esc(p.name)}" class="rp-couple__photo"></div>
      <h3 class="rp-couple__name rp-font-heading">${esc(p.name)}</h3>
      <p class="rp-couple__parents-label rp-font-label">${esc(p.parentLabel)}</p>
      <p class="rp-couple__parents rp-font-serif">${esc(p.parents||'')}</p>
    </article>`).join('')}</div>
    <p class="rp-couple__vow rp-font-serif">Bound by blessings, music, and sacred vows under one sky.</p>
  </div></section>`;
}

function renderCountdown(c){
  return `<section class="rp-countdown rp-section" id="countdown"><img src="${asset('jali-pattern.svg')}" class="rp-countdown__jali" alt=""><div class="rp-countdown__bg"></div><div class="rp-container rp-countdown__inner">
    <p class="rp-countdown__pretitle rp-font-label">Sacred Muhurat</p>
    <h2 class="rp-countdown__title rp-font-heading">Countdown to the Big Day</h2>
    <p class="rp-countdown__subtitle rp-font-serif">The auspicious moment is getting closer.</p>
    <div class="rp-countdown__grid">${['days','hours','minutes','seconds'].map(x=>`<div class="rp-countdown__cell"><span class="rp-countdown__value rp-countdown__value--${x} rp-font-heading">00</span><span class="rp-countdown__label rp-font-label">${x[0].toUpperCase()+x.slice(1)}</span></div>`).join('')}</div>
    <img src="${asset('ornate-divider.svg')}" class="rp-countdown__divider" alt="">
  </div></section>`;
}

function renderEvents(c){
  const meta=(e)=>{const t=(e.type||'').toLowerCase(),n=(e.name||'').toLowerCase();if(/haldi/.test(t+n))return ['Purity & Joy','A joyful turmeric ceremony with blessings from elders and playful family rituals.'];if(/mehndi|mehendi/.test(t+n))return ['Art & Tradition','Intricate henna, dhol beats, and colorful outfits that bring both families together.'];if(/sangeet/.test(t+n))return ['Music & Dance','An evening of performances, laughter, and stories celebrating both families.'];if(/wedding/.test(t+n))return ['Sacred Vows','Sacred mantras, varmala, and saat phere — the beginning of a new journey.'];if(/reception/.test(t+n))return ['Grand Celebration','A grand evening of dining, dancing, and celebrating the newlyweds.'];return ['Celebration',''];};
  return `<section class="rp-events rp-section" id="events"><img src="${esc(c.eventsBackground||c.coverPhoto||remoteAsset('ext-couple-hero.jpg'))}" class="rp-events__photo" alt="" loading="lazy" decoding="async"><div class="rp-events__veil"></div><div class="rp-container">
    <p class="rp-events__pretitle rp-font-label">Wedding Events</p><h2 class="rp-events__title rp-font-heading">Celebration Schedule</h2><p class="rp-events__subtitle rp-font-serif">Every ritual, every moment — beautifully planned for family and friends.</p><img src="${asset('lotus-divider.svg')}" class="rp-divider" alt="">
    <div class="rp-events__grid">${(c.events||[]).filter(e=>e&&e.name).map((e,i)=>{const [badge,desc]=meta(e);return `<article class="rp-events__card"><div class="rp-events__card-header"><div class="rp-events__icon-wrap"><span class="rp-events__icon" style="font-size:28px">${iconFor(e.type,e.name)}</span></div><p class="rp-events__badge rp-font-label">${badge}</p></div><h3 class="rp-events__name rp-font-heading">${esc(e.name)}</h3>${desc?`<p class="rp-events__ritual-desc rp-font-serif">${desc}</p>`:''}<p class="rp-events__meta rp-font-ui">${esc([e.date,e.time].filter(Boolean).join(' · '))}</p>${e.venue?`<p class="rp-events__venue rp-font-ui">${esc(e.venue)}</p>`:''}${e.mapLink?`<a href="${esc(e.mapLink)}" target="_blank" rel="noopener" class="rp-events__link rp-font-label">Get Directions →</a>`:''}</article>`}).join('')}</div>
  </div></section>`;
}

function renderGallery(c){
  const photos=(c.gallery||[]).filter(Boolean);
  return `<section class="rp-gallery rp-section" id="gallery"><img src="${asset('jali-pattern.svg')}" class="rp-gallery__jali" alt=""><div class="rp-container">
    <p class="rp-gallery__pretitle rp-font-label">Captured Chapters</p><h2 class="rp-gallery__title rp-font-heading">Memories in Bloom</h2><p class="rp-gallery__subtitle rp-font-serif">A glimpse of moments leading to our celebration.</p><img src="${asset('ornate-divider.svg')}" class="rp-gallery__divider" alt="">
    <div class="rp-gallery__grid">${photos.map((src,i)=>`<button class="rp-gallery__item" type="button" data-gallery-index="${i}"><img src="${esc(src)}" class="rp-gallery__image" alt="Gallery photo ${i+1}" loading="lazy" decoding="async"></button>`).join('')}</div>
  </div></section>`;
}

function getYoutubeId(url=''){
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/); return m?m[1]:null;
}
function renderVideo(c){
  if(!c.videoUrl) return '';
  const id=getYoutubeId(c.videoUrl); const src=id?`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`:c.videoUrl;
  return `<section class="rp-video rp-section" id="video"><div class="rp-container"><p class="rp-video__pretitle rp-font-label">Our Story in Motion</p><h2 class="rp-video__title rp-font-heading">${esc(c.videoTitle||'A Glimpse of Our Journey')}</h2><p class="rp-video__subtitle rp-font-serif">A little frame from the journey that brought us here.</p><img src="${asset('ornate-divider.svg')}" class="rp-video__divider" alt=""><div class="rp-video__player"><iframe class="rp-video__iframe" src="${esc(src)}" title="${esc(c.videoTitle||'Wedding video')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div></div></section>`;
}

function embedMap(url,name,address){
  if(!url) return '';
  if(/output=embed/.test(url)) return url;
  if(/maps\.google\.com|maps\.app\.goo\.gl|google\.com\/maps/.test(url)) return `https://www.google.com/maps?q=${encodeURIComponent(name+' '+address)}&output=embed`;
  return url;
}
function renderVenue(c){
  const map=embedMap(c.mapUrl,c.venueTitle,c.venueAddress);
  const events=(c.events||[]).filter(e=>e&&e.name);
  return `<section class="rp-venue rp-section" id="venue">
    <div class="rp-container">
      <p class="rp-venue__pretitle rp-font-label">Venue Guide</p>
      <h2 class="rp-venue__title rp-font-heading">Venue &amp; Travel</h2>
      <p class="rp-venue__subtitle rp-font-serif">Save the date and arrive with ease.</p>
      ${events.length ? `<div class="rp-venue__event-cards">${events.map((e,i)=>`<div class="rp-venue__event-card" data-event-index="${i}">
        <span class="rp-venue__event-name rp-font-label">${esc(e.name)}</span>
        <span class="rp-venue__event-detail rp-font-serif">${esc([e.date,e.time].filter(Boolean).join(' · '))}</span>
      </div>`).join('')}</div>` : `<div class="rp-venue__chips"><span class="rp-chip rp-font-label">${esc(fmtDate(c.weddingDate,c.displayDate))}</span><span class="rp-chip rp-font-label">${esc(c.weddingTime||'')}</span></div>`}
      <article class="rp-venue__card rp-venue__card--main">
        <p class="rp-venue__event-badge rp-font-label">${esc(events[0]?.name || 'Wedding Venue')}</p>
        <h3 class="rp-venue__name rp-font-heading">${esc(c.venueTitle||'Wedding Venue')}</h3>
        <p class="rp-venue__address rp-font-serif">${esc(c.venueAddress||'')}</p>
        ${map?`<div class="rp-venue__map-wrap"><iframe class="rp-venue__map" src="${esc(map)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" title="Venue map"></iframe></div>`:''}
        ${c.mapUrl?`<a class="rp-venue__btn rp-font-label" href="${esc(c.mapUrl)}" target="_blank" rel="noopener noreferrer">Get Directions →</a>`:''}
        <div class="rp-venue__notes">
          <h4 class="rp-venue__notes-title rp-font-heading">Travel Notes</h4>
          <ul class="rp-venue__notes-list rp-font-serif">${(c.travelNotes||[]).map(n=>`<li>${esc(n)}</li>`).join('')}</ul>
        </div>
      </article>
    </div>
  </section>`;
}

function renderLive(c){
  if(!c.liveUrl)return '';
  return `<section class="rp-live rp-section" id="live">
    <img src="${asset('jali-pattern.svg')}" class="rp-live__jali" alt="" aria-hidden="true">
    <div class="rp-container">
      <div class="rp-live__card">
        <div class="rp-live__badge rp-font-label"><span class="rp-live__dot"></span>Live Stream</div>
        <img src="${asset('ornate-divider.svg')}" class="rp-live__divider" alt="">
        <h2 class="rp-live__title rp-font-heading">Watch Live</h2>
        <p class="rp-live__subtitle rp-font-serif">Can't make it in person? Join us virtually as we celebrate this beautiful moment together.</p>
        <a href="${esc(c.liveUrl)}" target="_blank" rel="noopener noreferrer" class="rp-live__btn rp-font-label">
          <svg class="rp-live__btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="5" width="13" height="14" rx="2"></rect><path d="M16 10l5-3v10l-5-3z"></path>
          </svg>
          <span>Join Live Stream</span>
        </a>
        <p class="rp-live__note rp-font-serif">The live stream will begin 30 minutes before the ceremony.</p>
      </div>
    </div>
  </section>`;
}

function renderRsvp(c){
  const events=(c.events||[]).filter(e=>e&&e.name);
  return `<section class="rp-rsvp rp-section" id="rsvp">
    <img src="${asset('jali-pattern.svg')}" class="rp-rsvp__jali" alt="" aria-hidden="true">
    <div class="rp-container">
      <p class="rp-rsvp__pretitle rp-font-label">Join The Celebration</p>
      <h2 class="rp-rsvp__title rp-font-heading">RSVP &amp; Share</h2>
      <p class="rp-rsvp__subtitle rp-font-serif">We would be honored to celebrate this day with you.</p>
      <div class="rp-rsvp__card">
        <form class="rp-rsvp__form" id="rsvp-form">
          <div class="rp-rsvp__attendance">
            <button type="button" data-attend="yes" class="rp-rsvp__attendance-btn">Joyfully Accept</button>
            <button type="button" data-attend="no" class="rp-rsvp__attendance-btn">Regretfully Decline</button>
          </div>
          <label class="rp-rsvp__field rp-font-label">Your Name
            <input class="rp-rsvp__input" name="name" placeholder="Enter your name" required>
          </label>
          <div class="rp-rsvp__guest-row">
            <label class="rp-rsvp__field rp-font-label">Adults
              <select class="rp-rsvp__select" name="adults"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select>
            </label>
            <label class="rp-rsvp__field rp-font-label">Children
              <select class="rp-rsvp__select" name="children"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select>
            </label>
          </div>
          ${events.length?`<div class="rp-rsvp__field rp-font-label"><span>Events You'll Attend</span><div class="rp-rsvp__events">${events.map((e,i)=>`<label class="rp-rsvp__event-item" data-event-rsvp="${i}"><input type="checkbox" class="rp-rsvp__event-check" value="${i}"><span class="rp-rsvp__event-tick" aria-hidden="true"></span><span class="rp-rsvp__event-name">${esc(e.name)}</span><span class="rp-rsvp__event-date">${esc([e.date,e.time].filter(Boolean).join(' · '))}</span></label>`).join('')}</div></div>`:''}
          <label class="rp-rsvp__field rp-font-label">Message
            <textarea class="rp-rsvp__textarea" name="message" rows="4" placeholder="Blessings for the couple"></textarea>
          </label>
          <div class="rp-rsvp__actions">
            <button class="rp-rsvp__submit rp-font-label" type="submit">Send RSVP</button>
            <button class="rp-rsvp__whatsapp rp-font-label" type="button" id="rsvp-whatsapp-btn">
              <svg class="rp-share__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.297.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </button>
          </div>
          <p class="rp-rsvp__status rp-font-serif" id="rsvp-status" role="status"></p>
        </form>
      </div>
    </div>
  </section>`;
}

function renderShare(c){
  return `<section class="rp-share rp-section" id="share">
    <img src="${asset('jali-pattern.svg')}" class="rp-share__jali" alt="" aria-hidden="true">
    <div class="rp-container">
      <p class="rp-share__pretitle rp-font-label">Spread The Joy</p>
      <h2 class="rp-share__title rp-font-heading">Share This Invitation</h2>
      <p class="rp-share__subtitle rp-font-serif">Let your loved ones know about our special day</p>
      <img class="rp-share__divider-img" src="${asset('ornate-divider.svg')}" alt="">
      <div class="rp-share__grid">
        <button type="button" class="rp-share__btn rp-share__btn--whatsapp" id="share-whatsapp-btn">
          <svg class="rp-share__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.198.198-.297.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span class="rp-share__label">WhatsApp</span>
        </button>
        <button type="button" class="rp-share__btn rp-share__btn--calendar" id="calendar-btn">
          <svg class="rp-share__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="10" y1="14" x2="14" y2="14"></line><line x1="12" y1="12" x2="12" y2="16"></line></svg><span class="rp-share__label">Add to Calendar</span>
        </button>
        <button type="button" class="rp-share__btn rp-share__btn--copy" id="copy-link-btn">
          <svg class="rp-share__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg><span class="rp-share__label">Copy Link</span>
        </button>
      </div>
    </div>
  </section>`;
}

function renderFooter(c){
  return `<footer class="rp-footer rp-section" id="footer"><img src="${esc(c.footerBackground||c.coverPhoto||remoteAsset('ext-couple-hero.jpg'))}" class="rp-footer__photo" alt="" loading="lazy" decoding="async"><div class="rp-footer__content rp-container"><img src="${asset('ornate-divider.svg')}" class="rp-footer__divider" alt=""><p class="rp-footer__label rp-font-label">The Beginning of Forever</p><div class="rp-footer__names rp-font-script"><span class="rp-footer__name">${esc(c.partnerOne)}</span><span class="rp-footer__amp">&amp;</span><span class="rp-footer__name">${esc(c.partnerTwo)}</span></div><div class="rp-footer__date rp-font-label">${esc(fmtDate(c.weddingDate,c.displayDate))} · ${esc(c.weddingTime||'')}</div><p class="rp-footer__hash rp-font-serif">${esc(c.hashtag||'')}</p><p class="rp-footer__line rp-font-serif">With love, laughter, and blessings.</p></div></footer>`;
}

// Phones have far less GPU headroom than the desktop this was tuned on, and
// every petal is its own promoted layer running an endless tween.
function isSmallScreen(){ return window.matchMedia?.('(max-width: 767px)').matches; }
function isLowPower(){
  return isSmallScreen()
    || (navigator.hardwareConcurrency||8)<=4
    || navigator.connection?.saveData===true;
}

function firePetalBurst(){
  const layer=document.querySelector('#rp-bloom-petals');
  if(!layer)return;
  layer.innerHTML='';
  const count=isLowPower()?14:26;
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    el.className='rp-bloom-petal';
    el.innerHTML=`<img src="${asset('petal.svg')}" alt="">`;
    layer.appendChild(el);
    const angle=(Math.PI*2/count)*i + gsap.utils.random(-0.18,0.18);
    const distance=gsap.utils.random(Math.min(window.innerWidth,window.innerHeight)*0.35, Math.max(window.innerWidth,window.innerHeight)*0.82);
    const x=Math.cos(angle)*distance;
    const y=Math.sin(angle)*distance*0.75;
    const spin=gsap.utils.random(-360,360);
    gsap.set(el,{x:'-50%',y:'-50%',opacity:0,scale:gsap.utils.random(.45,.9),rotation:gsap.utils.random(-25,25)});
    gsap.to(el,{x:`calc(-50% + ${x}px)`,y:`calc(-50% + ${y}px)`,opacity:gsap.utils.random(.55,.95),rotation:`+=${spin}`,duration:gsap.utils.random(.9,1.35),ease:'power2.out',delay:gsap.utils.random(0,.12)});
    gsap.to(el,{opacity:0,duration:.65,delay:1.05+gsap.utils.random(0,.3),ease:'power2.in',onComplete:()=>el.remove()});
  }
}

function animateEntry(){
  const entry=document.querySelector('#rp-entry');
  const tl=gsap.timeline({defaults:{ease:'power2.out'},onComplete(){
    // Start the idle sway only once the reveal finished, so the two tweens
    // never fight over the mandala's rotation.
    state.mandalaIdle=gsap.to('.rp-entry__mandala',{rotate:4,duration:6,ease:'sine.inOut',yoyo:true,repeat:-1});
  }});
  tl.from('.rp-entry__glow',{scale:.6,opacity:0,duration:1.2})
    .from('.rp-entry__mandala',{scale:.7,opacity:0,rotate:-12,duration:1.1},'-=.7')
    .from('.rp-entry__title',{y:14,opacity:0,duration:.65},'-=.4')
    .from('.rp-entry__names',{y:24,opacity:0,scale:.95,duration:.85},'-=.3')
    .from('.rp-entry__ornament',{scaleX:0,opacity:0,duration:.7},'-=.3')
    .from('.rp-entry__cta',{y:18,opacity:0,duration:.65},'-=.25');
  state.entryTimeline=tl;
  document.body.style.overflow='hidden';
}

function startGlobalFlowerRain(){
  const layer=document.querySelector('#rp-global-rain');
  if(!layer || layer.dataset.started==='true') return;
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  layer.dataset.started='true';
  layer.innerHTML='';
  const count=isLowPower()?18:50;
  const random=gsap.utils.random;
  const petals=[];
  for(let i=0;i<count;i++){
    const el=document.createElement('div');
    el.className='rp-rain__petal';
    el.innerHTML=`<img src="${asset('petal.svg')}" alt="">`;
    layer.appendChild(el);
    petals.push(el);
  }
  const configure=()=>{
    const width=window.innerWidth;
    const height=window.innerHeight;
    petals.forEach((petal)=>{
      gsap.set(petal,{
        x:random(-24,width+24),
        y:random(-80,height+80),
        opacity:random(.25,.85),
        scale:random(.45,1.1),
        rotate:random(-40,40),
      });
    });
  };
  configure();
  petals.forEach((petal)=>{
    const duration=random(8,15);
    const drift=random(-120,120);
    const spin=random(120,420);
    const delay=random(0,.6);
    gsap.to(petal,{
      y:()=>window.innerHeight+180,
      x:`+=${drift}`,
      rotate:`+=${spin}`,
      ease:'none',
      duration,
      delay,
      repeat:-1,
      repeatRefresh:true,
      onRepeat:()=>{
        gsap.set(petal,{
          y:-100,
          x:random(-24,window.innerWidth+24),
          opacity:random(.25,.85),
          scale:random(.45,1.1),
          rotate:random(-60,60),
        });
      },
    });
  });
  gsap.to(layer,{opacity:1,duration:.35,ease:'power2.out'});
  window.addEventListener('resize',configure,{passive:true});
}

function fireGoldenBurst(){
  const gold='#d9a34b', cream='#fff4da', soft='#f5d99d';
  confetti({particleCount:80,spread:90,startVelocity:42,origin:{x:.5,y:.5},colors:[gold,cream,soft,'#cc9448'],shapes:['circle'],gravity:.6,scalar:1.1,ticks:120,zIndex:200});
  setTimeout(()=>confetti({particleCount:40,angle:60,spread:55,startVelocity:35,origin:{x:.25,y:.55},colors:[gold,soft,cream],shapes:['circle'],gravity:.7,scalar:.9,ticks:100,zIndex:200}),100);
  setTimeout(()=>confetti({particleCount:40,angle:120,spread:55,startVelocity:35,origin:{x:.75,y:.55},colors:[gold,soft,cream],shapes:['circle'],gravity:.7,scalar:.9,ticks:100,zIndex:200}),150);
}

const GROOM_CHARS='.rp-hero__name:first-child .rp-hero__char';
const BRIDE_CHARS='.rp-hero__name:last-child .rp-hero__char';

// One definition of the hero reveal, used twice: once to park every element in
// its starting state before the main screen is uncovered, once to play it.
// Keeping them together is what stops the names from showing fully formed and
// then jumping back to animate a second time.
const HERO_INTRO=[
  {at:.15, target:'.rp-hero__line',     from:{scaleX:0},                          to:{scaleX:1,duration:.8,ease:'power2.inOut'}},
  {at:.35, target:'.rp-hero__ganesha',  from:{scale:.65,opacity:0},               to:{scale:1,opacity:1,duration:.65,ease:'back.out(1.7)'}},
  {at:.55, target:'.rp-hero__label',    from:{y:14,opacity:0},                    to:{y:0,opacity:1,duration:.6}},
  {at:.75, target:GROOM_CHARS,          from:{x:-72,y:20,opacity:0,rotateX:-40},  to:{x:0,y:0,opacity:1,rotateX:0,stagger:.055,duration:.7,ease:'back.out(1.7)'}},
  {at:1.45,target:BRIDE_CHARS,          from:{x:72,y:20,opacity:0,rotateX:-40},   to:{x:0,y:0,opacity:1,rotateX:0,stagger:.055,duration:.7,ease:'back.out(1.7)'}},
  {at:1.95,target:'.rp-hero__amp',      from:{scale:0,opacity:0},                 to:{scale:1,opacity:1,duration:.55,ease:'back.out(2)'}},
  {at:2.15,target:'.rp-hero__chip',     from:{scale:.8,opacity:0},                to:{scale:1,opacity:1,duration:.55,ease:'back.out(1.6)'}},
  {at:2.35,target:'.rp-hero__welcome',  from:{y:16,opacity:0},                    to:{y:0,opacity:1,duration:.6}},
  {at:2.55,target:'.rp-hero__ornament', from:{scaleX:0,opacity:0},                to:{scaleX:1,opacity:1,duration:.7,ease:'power2.inOut'}},
  {at:2.75,target:'.rp-hero__scroll',   from:{y:14,opacity:0},                    to:{y:0,opacity:1,duration:.55}},
];

function primeMainIntro(){
  gsap.set('.rp-hero__photo',{scale:1.15});
  HERO_INTRO.forEach(step=>gsap.set(step.target,step.from));
}

function playMainIntro(){
  const main=document.querySelector('#rp-main');
  main.classList.add('is-visible');
  primeMainIntro(); // harmless if handleOpen already primed; required when it did not
  const light=isLowPower();
  const tl=gsap.timeline({defaults:{ease:'power3.out'},onComplete(){
    // Only hand the hero photo to the scroll parallax once the opening zoom has
    // finished, so the two never animate `scale` at the same time. Skipped on
    // phones: rescaling a full-screen photo every scroll frame is the single
    // most expensive thing on the page there.
    if(!light) gsap.to('.rp-hero__photo',{yPercent:20,scale:1.08,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1.2},ease:'none'});
  }});
  tl.to('.rp-hero__photo',{scale:1,duration:2,ease:'power2.out'},0);
  HERO_INTRO.forEach(step=>tl.to(step.target,step.to,step.at));
  if(!light) gsap.to('.rp-hero__mandala-bg',{rotate:30,scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:2},ease:'none'});
  gsap.to('.rp-hero__content',{y:-60,opacity:.3,scrollTrigger:{trigger:'#hero',start:'30% top',end:'bottom top',scrub:1},ease:'none'});
  ScrollTrigger.refresh();
  if(!state.scrollReady){state.scrollReady=true; initScrollAnimations();}
}

function handleOpen(){
  if(state.opened)return; state.opened=true;
  const entry=document.querySelector('#rp-entry');
  const main=document.querySelector('#rp-main');
  // The reveal timeline and the idle sway both own the mandala's rotation;
  // stop them before the exit tween takes over.
  state.entryTimeline?.progress(1);
  state.mandalaIdle?.kill();
  // The main screen is uncovered part-way through this timeline, so the hero
  // has to already be in its pre-animation state by then.
  primeMainIntro();
  const tl=gsap.timeline({onComplete(){entry.style.display='none';document.body.style.overflow='';playMainIntro();state.audio?.play().catch(()=>{});}});
  tl.to('.rp-entry__cta',{scale:.9,duration:.12,ease:'power2.in'})
    .to('.rp-entry__cta',{scale:1.15,opacity:0,duration:.3,ease:'power2.out'})
    .to('.rp-entry__title,.rp-entry__ornament',{y:-40,opacity:0,stagger:.04,duration:.4,ease:'power3.in'},'-=.15')
    .to('.rp-entry__names',{scale:1.12,opacity:0,duration:.5,ease:'power2.in'},'<.1')
    .set(main,{visibility:'visible'})
    .to('.rp-entry__mandala',{scale:6,rotate:180,opacity:0,duration:1.2,ease:'power2.in'},'-=.35')
    .to('.rp-entry__glow',{scale:8,opacity:1,duration:.8,ease:'power2.in'},'-=1')
    .call(()=>{startGlobalFlowerRain();firePetalBurst();fireGoldenBurst();},[],'-=.55')
    .to('.rp-entry__flash',{opacity:1,duration:.35,ease:'power2.in'},'-=.35')
    .to(entry,{opacity:0,duration:.5,ease:'power2.out'});
}

function initMusic(c){
  const btn=document.querySelector('#music-btn');
  if(!btn||!c.musicUrl)return;

  const label=btn.querySelector('.rp-music__text');
  const audio=new Audio(c.musicUrl);
  audio.loop=true;
  audio.preload='auto';
  state.audio=audio;

  // Keep the visual state fully explicit instead of relying on a later media event.
  const setMusicUI=(playing)=>{
    const isPlaying=Boolean(playing);
    if(label) label.textContent=isPlaying?'Sound On':'Sound Off';
    btn.setAttribute('aria-pressed',String(isPlaying));
    btn.dataset.playing=String(isPlaying);
    btn.classList.toggle('is-playing',isPlaying);
    btn.title=isPlaying?'Turn music off':'Turn music on';
  };

  const sync=()=>setMusicUI(!audio.paused && !audio.ended);

  audio.addEventListener('play',()=>setMusicUI(true));
  audio.addEventListener('playing',()=>setMusicUI(true));
  audio.addEventListener('pause',()=>setMusicUI(false));
  audio.addEventListener('ended',()=>setMusicUI(false));

  btn.addEventListener('click',async()=>{
    if(audio.paused || audio.ended){
      try{
        await audio.play();
        // Explicitly update after play() resolves so the label cannot remain stale.
        setMusicUI(true);
      }catch(error){
        setMusicUI(false);
        console.warn('Music could not be toggled:',error);
      }
    }else{
      audio.pause();
      // Update immediately; do not wait for the pause event.
      setMusicUI(false);
    }
  });

  // Initial state is definitely OFF until playback actually starts.
  sync();
}

function countdown(){
  const target=new Date(state.config.weddingDate||'').getTime();
  const now=Date.now(); let diff=Math.max(0,Math.floor((target-now)/1000));
  const days=Math.floor(diff/86400); diff%=86400; const hours=Math.floor(diff/3600); diff%=3600; const minutes=Math.floor(diff/60); const seconds=diff%60;
  const vals={days,hours,minutes,seconds}; for(const k of Object.keys(vals)){const el=document.querySelector(`.rp-countdown__value--${k}`);if(el){const next=String(vals[k]).padStart(2,'0'); if(el.textContent!==next){gsap.fromTo(el,{y:-8,opacity:.4},{y:0,opacity:1,duration:.35,ease:'power2.out'});el.textContent=next;}}}
}

function initScrollAnimations(){
  // Couple — stronger horizontal slide and layered reveal.
  gsap.from('.rp-couple__heading',{scrollTrigger:{trigger:'#couple',start:'top 84%',toggleActions:'play none none none'},y:30,opacity:0,scale:.92,duration:.9,ease:'power3.out'});
  gsap.from('.rp-couple__sub',{scrollTrigger:{trigger:'#couple',start:'top 80%',toggleActions:'play none none none'},y:18,opacity:0,duration:.7,delay:.15});
  const coupleCards=document.querySelectorAll('.rp-couple__card');
  if(coupleCards[0]) gsap.from(coupleCards[0],{scrollTrigger:{trigger:coupleCards[0],start:'top 88%',toggleActions:'play none none none'},x:-85,opacity:0,rotation:-4,duration:1.05,ease:'power3.out'});
  if(coupleCards[1]) gsap.from(coupleCards[1],{scrollTrigger:{trigger:coupleCards[1],start:'top 88%',toggleActions:'play none none none'},x:85,opacity:0,rotation:4,duration:1.05,ease:'power3.out'});
  document.querySelectorAll('.rp-couple__photo').forEach(photo=>gsap.from(photo,{scrollTrigger:{trigger:photo,start:'top 90%',toggleActions:'play none none none'},scale:1.24,duration:1.25,ease:'power2.out'}));
  document.querySelectorAll('.rp-couple__arch').forEach(arch=>gsap.from(arch,{scrollTrigger:{trigger:arch,start:'top 90%',toggleActions:'play none none none'},opacity:0,scale:.82,duration:.95,ease:'power2.out'}));
  gsap.from('.rp-couple__name,.rp-couple__parents-label,.rp-couple__parents',{scrollTrigger:{trigger:'#couple',start:'top 74%',toggleActions:'play none none none'},y:18,opacity:0,stagger:.08,duration:.65,ease:'power2.out'});
  gsap.from('.rp-couple__vow',{scrollTrigger:{trigger:'.rp-couple__vow',start:'top 92%',toggleActions:'play none none none'},y:20,opacity:0,duration:.8,ease:'power2.out'});

  // Events.
  gsap.from('.rp-events__title',{scrollTrigger:{trigger:'#events',start:'top 85%',toggleActions:'play none none none'},y:30,opacity:0,duration:.8,ease:'power3.out'});
  gsap.from('.rp-events__subtitle',{scrollTrigger:{trigger:'#events',start:'top 82%',toggleActions:'play none none none'},y:20,opacity:0,duration:.7,delay:.15});
  document.querySelectorAll('.rp-events__card').forEach((card,i)=>gsap.from(card,{scrollTrigger:{trigger:card,start:'top 88%',toggleActions:'play none none none'},x:i%2===0?-55:55,y:30,opacity:0,rotation:i%2===0?-2:2,duration:.9,ease:'power3.out'}));
  document.querySelectorAll('.rp-events__icon-wrap').forEach(w=>gsap.from(w,{scrollTrigger:{trigger:w,start:'top 92%',toggleActions:'play none none none'},scale:0,rotation:-180,duration:.7,ease:'back.out(1.8)'}));

  // Countdown/gallery/video.
  gsap.from('.rp-countdown__title,.rp-countdown__subtitle',{scrollTrigger:{trigger:'#countdown',start:'top 86%',toggleActions:'play none none none'},y:28,opacity:0,duration:.8,stagger:.12,ease:'power3.out'});
  gsap.from('.rp-countdown__cell',{scrollTrigger:{trigger:'#countdown',start:'top 88%',toggleActions:'play none none none'},y:40,opacity:0,duration:.85,stagger:.1,ease:'back.out(1.7)'});
  gsap.from('.rp-gallery__title,.rp-gallery__subtitle',{scrollTrigger:{trigger:'#gallery',start:'top 86%',toggleActions:'play none none none'},y:28,opacity:0,duration:.8,stagger:.12,ease:'power3.out'});
  document.querySelectorAll('.rp-gallery__item').forEach((item,i)=>gsap.from(item,{scrollTrigger:{trigger:item,start:'top 92%',toggleActions:'play none none none'},scale:.72,opacity:0,rotation:i%2?4:-4,y:40,duration:.8,delay:i*.06,ease:'power3.out'}));
  gsap.from('.rp-video__title,.rp-video__subtitle',{scrollTrigger:{trigger:'#video',start:'top 86%',toggleActions:'play none none none'},y:28,opacity:0,duration:.8,stagger:.12,ease:'power3.out'});
  gsap.from('.rp-video__player',{scrollTrigger:{trigger:'#video',start:'top 90%',toggleActions:'play none none none'},y:50,opacity:0,scale:.96,duration:1,ease:'power3.out'});

  // Venue — event chips animate independently, then the map card slides up.
  gsap.from('.rp-venue__title,.rp-venue__subtitle',{scrollTrigger:{trigger:'#venue',start:'top 85%',toggleActions:'play none none none'},y:28,opacity:0,duration:.8,stagger:.12,ease:'power3.out'});
  document.querySelectorAll('.rp-venue__event-card').forEach((card,i)=>gsap.from(card,{scrollTrigger:{trigger:card,start:'top 90%',toggleActions:'play none none none'},scale:.85,y:18,opacity:0,delay:i*.08,duration:.7,ease:'back.out(1.4)'}));
  gsap.from('.rp-venue__chips .rp-chip',{scrollTrigger:{trigger:'#venue',start:'top 90%',toggleActions:'play none none none'},scale:.8,opacity:0,stagger:.1,duration:.6,ease:'back.out(1.4)'});
  gsap.from('.rp-venue__card',{scrollTrigger:{trigger:'.rp-venue__card',start:'top 92%',toggleActions:'play none none none'},y:50,opacity:0,scale:.96,duration:1,ease:'power3.out',delay:.12});
  gsap.from('.rp-venue__map-wrap',{scrollTrigger:{trigger:'.rp-venue__map-wrap',start:'top 92%',toggleActions:'play none none none'},clipPath:'inset(100% 0 0 0)',duration:1,ease:'power2.inOut'});
  gsap.from('.rp-venue__notes-list li',{scrollTrigger:{trigger:'.rp-venue__notes-list',start:'top 92%',toggleActions:'play none none none'},x:-20,opacity:0,stagger:.12,duration:.6,ease:'power2.out'});

  // Live.
  gsap.from('.rp-live__card',{scrollTrigger:{trigger:'#live',start:'top 86%',toggleActions:'play none none none'},y:40,opacity:0,scale:.96,duration:.9,ease:'power3.out'});
  gsap.to('.rp-live__dot',{scale:1.4,opacity:.5,duration:.8,ease:'sine.inOut',yoyo:true,repeat:-1});
  gsap.from('.rp-live__btn',{scrollTrigger:{trigger:'#live',start:'top 80%',toggleActions:'play none none none'},y:18,opacity:0,scale:.92,duration:.6,delay:.25,ease:'back.out(1.5)'});

  // RSVP — match original scroll reveal and moving jali.
  gsap.from('.rp-rsvp__title',{scrollTrigger:{trigger:'#rsvp',start:'top 84%',toggleActions:'play none none none'},y:30,opacity:0,scale:.95,duration:.85,ease:'power3.out'});
  gsap.from('.rp-rsvp__subtitle',{scrollTrigger:{trigger:'#rsvp',start:'top 82%',toggleActions:'play none none none'},y:20,opacity:0,duration:.7,delay:.15});
  gsap.from('.rp-rsvp__card',{scrollTrigger:{trigger:'#rsvp',start:'top 84%',toggleActions:'play none none none'},y:50,opacity:0,duration:1,ease:'power3.out',delay:.2});
  gsap.to('.rp-rsvp__jali',{yPercent:-12,scrollTrigger:{trigger:'#rsvp',start:'top bottom',end:'bottom top',scrub:1.5},ease:'none'});

  // Share — exact original wording + staggered buttons.
  gsap.from('.rp-share__title',{scrollTrigger:{trigger:'#share',start:'top 84%',toggleActions:'play none none none'},y:24,opacity:0,duration:.8,ease:'power3.out'});
  gsap.from('.rp-share__subtitle',{scrollTrigger:{trigger:'#share',start:'top 84%',toggleActions:'play none none none'},y:18,opacity:0,duration:.7,delay:.12});
  gsap.from('.rp-share__divider-img',{scrollTrigger:{trigger:'#share',start:'top 84%',toggleActions:'play none none none'},scaleX:0,opacity:0,duration:.9,delay:.18,ease:'power2.out'});
  gsap.from('.rp-share__btn',{scrollTrigger:{trigger:'#share',start:'top 84%',toggleActions:'play none none none'},y:30,opacity:0,duration:.7,stagger:.1,delay:.25,ease:'power3.out'});
  ScrollTrigger.refresh();
}

function invitationUrl(){
  return `${window.location.origin}${window.location.pathname}`;
}

// The whole message must be encoded. The couple's names contain "&", and an
// unencoded one ends the query string — which is why every shared RSVP used
// to arrive truncated at the first name.
function openWhatsApp(text){
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');
}

// This button is the fallback the submit handler points guests to when the
// RSVP server is unreachable, so it has to carry the whole reply, not just a
// name.
function rsvpWhatsAppMessage(){
  const c=state.config;
  const form=document.querySelector('#rsvp-form');
  const field=(name)=>String(form?.elements?.[name]?.value||'').trim();
  const guestName=field('name');
  const adults=Number(field('adults')||1);
  const children=Number(field('children')||0);
  const attending=form?.dataset.attendance!=='no';
  const events=Array.from(document.querySelectorAll('.rp-rsvp__event-check:checked'))
    .map(x=>c.events?.[Number(x.value)]?.name).filter(Boolean);
  const note=field('message');

  const lines=[`RSVP for ${c.partnerOne} & ${c.partnerTwo}'s wedding`,''];
  lines.push(`Name: ${guestName||'(not given)'}`);
  lines.push(attending?'Attending: Yes':'Attending: No');
  if(attending){
    const party=[`${adults} adult${adults===1?'':'s'}`];
    if(children>0) party.push(`${children} child${children===1?'':'ren'}`);
    lines.push(`Guests: ${party.join(' + ')}`);
    if(events.length) lines.push(`Events: ${events.join(', ')}`);
  }
  if(note) lines.push('',note);
  lines.push('',invitationUrl());
  return lines.join('\n');
}

function initInteractions(){
  document.querySelector('#open-invitation')?.addEventListener('click',handleOpen);

  document.querySelectorAll('[data-gallery-index]').forEach(btn=>btn.addEventListener('click',()=>{
    const src=state.config.gallery?.[Number(btn.dataset.galleryIndex)]; if(!src)return;
    const overlay=document.createElement('div'); overlay.className='rp-lightbox'; overlay.innerHTML=`<button type="button" aria-label="Close">×</button><img src="${esc(src)}" alt="">`; document.body.appendChild(overlay); overlay.querySelector('button').onclick=()=>overlay.remove(); overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
  }));

  document.querySelectorAll('[data-attend]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-attend]').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    document.querySelector('#rsvp-form')?.setAttribute('data-attendance',btn.dataset.attend);
  }));

  document.querySelectorAll('.rp-rsvp__event-item').forEach(item=>item.addEventListener('click',()=>{
    const checkbox=item.querySelector('.rp-rsvp__event-check');
    if(!checkbox)return;
    checkbox.checked=!checkbox.checked;
    item.classList.toggle('is-selected',checkbox.checked);
    const tick=item.querySelector('.rp-rsvp__event-tick');
    if(tick) tick.innerHTML=checkbox.checked?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true"><path d="M1 4L3.8 7L9 1" stroke="#1a0e00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>':'';
  }));

  document.querySelector('#rsvp-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const form=e.currentTarget;
    const status=document.querySelector('#rsvp-status');
    const fd=new FormData(form);
    const payload={
      name:String(fd.get('name')||''),
      guests:Number(fd.get('adults')||1)+Number(fd.get('children')||0),
      adults:Number(fd.get('adults')||1),
      children:Number(fd.get('children')||0),
      message:String(fd.get('message')||''),
      attendance:form.dataset.attendance||'yes',
      events:Array.from(document.querySelectorAll('.rp-rsvp__event-check:checked')).map(x=>state.config.events?.[Number(x.value)]?.name).filter(Boolean)
    };
    status.textContent='Sending…';
    try{
      const r=await fetch('/api/rsvp',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      if(!r.ok)throw new Error();
      status.textContent='Thank you — your RSVP has been received.';
      form.reset();
      document.querySelectorAll('.rp-rsvp__event-item').forEach(i=>i.classList.remove('is-selected'));
      document.querySelectorAll('[data-attend]').forEach(b=>b.classList.remove('is-active'));
    }catch{
      status.textContent='Saved in this browser. Please also send us a WhatsApp message if the RSVP server is unavailable.';
      localStorage.setItem('lastRsvp',JSON.stringify(payload));
    }
  });

  document.querySelector('#rsvp-whatsapp-btn')?.addEventListener('click',()=>{
    openWhatsApp(rsvpWhatsAppMessage());
  });

  document.querySelector('#share-whatsapp-btn')?.addEventListener('click',()=>{
    const c=state.config;
    openWhatsApp(`You're invited to ${c.partnerOne} & ${c.partnerTwo}'s wedding!\n\n${invitationUrl()}`);
  });

  document.querySelector('#calendar-btn')?.addEventListener('click',()=>{
    const c=state.config; const dt=new Date(c.weddingDate||'');
    const start=dt.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const end=new Date(dt.getTime()+2*3600*1000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${c.partnerOne} & ${c.partnerTwo} Wedding`,`LOCATION:${c.venueTitle||''}`,`DESCRIPTION:${c.intro||''}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='wedding.ics'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  });

  document.querySelector('#copy-link-btn')?.addEventListener('click',async()=>{
    const btn=document.querySelector('#copy-link-btn');
    const label=btn?.querySelector('.rp-share__label');
    const original=label?.textContent||'Copy Link';
    try{
      await navigator.clipboard.writeText(window.location.href);
    }catch{
      const input=document.createElement('input'); input.value=window.location.href; document.body.appendChild(input); input.select(); document.execCommand('copy'); input.remove();
    }
    if(label)label.textContent='Link Copied!';
    setTimeout(()=>{if(label)label.textContent=original;},2400);
  });
}

// Photos decide how tall every section is, so ScrollTrigger's start/end
// positions are wrong until they have loaded. Refresh once each one settles,
// and drop any image whose URL is dead so it cannot leave an empty frame.
function watchPhotos(){
  let timer=null;
  const refresh=()=>{ clearTimeout(timer); timer=setTimeout(()=>ScrollTrigger.refresh(),120); };
  document.querySelectorAll('.royal-premium img').forEach(img=>{
    img.addEventListener('error',()=>{
      img.dataset.failed='true';
      img.style.display='none';
      console.warn('Photo failed to load:',img.getAttribute('src'));
      refresh();
    },{once:true});
    if(!img.complete) img.addEventListener('load',refresh,{once:true});
  });
  // Give each gallery tile its photo's own shape, so the masonry column sizes
  // to the picture instead of cropping the picture to fit the tile.
  document.querySelectorAll('.rp-gallery__image').forEach(img=>{
    const fit=()=>{
      if(!img.naturalWidth || !img.naturalHeight) return;
      img.style.aspectRatio=`${img.naturalWidth} / ${img.naturalHeight}`;
      refresh();
    };
    if(img.complete) fit(); else img.addEventListener('load',fit,{once:true});
  });
  window.addEventListener('load',refresh,{once:true});
}

// Netlify's free tier injects a "Powered by Netlify" badge as a fixed iframe in
// the bottom-right corner, stacked above everything (z-index ~2^31), so the
// page cannot draw over it. Lift the sound button clear of it instead. The
// badge is added by the host after the page loads, may shrink to a mini pill,
// and expands into a 366x334 card when tapped; follow the collapsed size only,
// so the button does not jump whenever a guest opens that card.
const BADGE_COLLAPSED_MAX=100;
function keepClearOfHostBadge(){
  // No sound button (music hidden in the editor): nothing needs moving.
  if(!document.querySelector('#music-btn')) return;
  // Set on the root so both the button and the hero can read it.
  const root=document.documentElement;
  let watched=null, sizeWatch=null;
  const apply=()=>{
    const badge=document.querySelector('#nl-badge-frame');
    if(badge!==watched){
      sizeWatch?.disconnect();
      watched=badge;
      if(badge && 'ResizeObserver' in window){
        sizeWatch=new ResizeObserver(apply);
        sizeWatch.observe(badge);
      }
    }
    if(!badge){ root.style.setProperty('--rp-badge-clearance','0px'); return; }
    const s=getComputedStyle(badge), r=badge.getBoundingClientRect();
    if(s.display==='none' || s.visibility==='hidden' || r.height===0){
      root.style.setProperty('--rp-badge-clearance','0px');
      return;
    }
    if(r.height>BADGE_COLLAPSED_MAX) return; // card is open; keep the last position
    // Distance from the badge's top edge to the bottom of the viewport.
    root.style.setProperty('--rp-badge-clearance',`${Math.ceil(window.innerHeight-r.top)}px`);
  };
  apply();
  new MutationObserver(apply).observe(document.body,{childList:true});
  window.addEventListener('resize',apply,{passive:true});
}

async function start(){
  state.config=await loadConfig(); renderShell(); watchPhotos(); initMusic(state.config); animateEntry(); setInterval(countdown,1000); countdown();
  initInteractions();
  keepClearOfHostBadge();
  fitNames();
  // The script face loads with font-display:swap, so the first measurement is
  // of the fallback. Measure again once the real font is in.
  document.fonts?.ready.then(fitNames).catch(()=>{});
  // keep root ready for browser resize
  let resizeTimer=null;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{fitNames();ScrollTrigger.refresh();},150);
  });
  window.addEventListener('orientationchange',()=>setTimeout(fitNames,250));
}
start().catch((error)=>{
  console.error('Wedding invitation failed to initialize:', error);
  if (root) {
    root.innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;background:#12091f;color:#f7ecd5;font-family:Manrope,system-ui,sans-serif;padding:24px;text-align:center"><div><h1 style="margin:0 0 10px;color:#f5d99d">Invitation could not load</h1><p style="max-width:620px;line-height:1.6;opacity:.8">A JavaScript asset failed to load. Check the browser Console for the exact error.</p><pre style="white-space:pre-wrap;text-align:left;max-width:900px;margin:18px auto 0;padding:14px;border:1px solid rgba(245,217,157,.22);border-radius:12px;background:rgba(0,0,0,.18)">${esc(error?.stack || error?.message || String(error))}</pre></div></div>`;
  }
});
