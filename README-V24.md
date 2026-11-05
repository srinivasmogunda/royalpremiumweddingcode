# V24 — photos and opening animation

Three things were broken. Each is fixed below.

## 1. Photos were not showing

The section photos were loading correctly all along — they were buried under
near-opaque overlays, so every background rendered as flat dark purple.

| Layer | Photo opacity | Overlay on top | Net visibility |
|---|---|---|---|
| Hero | 0.42 | `.rp-hero__bg` 0.90→0.96 **plus** `.rp-hero__veil` 0.35→0.82 | ~2% |
| Entry | 0.28 | `.rp-entry__veil` 0.84→0.96 | ~3% |
| Events | 0.24 | `.rp-events__veil` 0.90→0.95 | ~2% |
| Footer | 0.20 | — | faint |

Fixed in `app.css` (new block at the end): photo opacity raised and the veil
gradients thinned to the point where text still reads clearly. The couple
portraits and the gallery were never affected — those have no veil.

Also added: an image that fails to load is now hidden instead of leaving an
empty frame, and `ScrollTrigger` is refreshed as photos finish loading, so the
scroll reveals below the fold no longer measure against a stale page height.

## 2. Photos were not uploading

Two causes, both in `admin.js`:

- **No error was ever shown.** Every file input had an uncaught `async`
  handler, so a failed upload rejected silently — you picked a photo and
  nothing happened at all. All inputs now go through `handleFiles()`, which
  reports the reason in the status bar and clears the input so re-picking the
  same file works.
- **Phone photos were too big.** The hosted upload endpoint rejects request
  bodies past roughly 4.5 MB of binary, and phone photos run 3–12 MB. Images
  are now downscaled in the browser before upload (max edge 1920px, JPEG,
  quality stepped down until it fits). A 7.8 MB 4032×3024 photo becomes a
  380 KB 1920×1440 one — which also makes the invitation much faster for
  guests.

In local/static mode (no server), photos are embedded in the page itself and
are compressed harder so `localStorage` does not overflow; if it still does,
the message now says what to do instead of showing a raw browser error.

## 3. Animations

- **Opening screen.** `animateEntry()` and `handleOpen()` passed positions like
  `'-.4'` to GSAP. That is not a relative offset — `'-=.4'` is. GSAP read them
  as absolute times, so the title, names, ornament and button were scheduled at
  or *before* t=0 and popped in together, partly pre-rendered, instead of
  cascading. Child start times went from `[-0.25, 0, 0.3, 0.6, 1, 1.5]` to
  `[0, 0.5, 1.2, 1.55, 2.1, 2.55]`.
- **Names appeared before the animation.** `handleOpen()` uncovers the main
  screen about 1.2s in, but `playMainIntro()` only ran when that timeline
  finished at ~2.8s — so the hero showed fully formed, then snapped back and
  animated in a second time. The reveal is now defined once in `HERO_INTRO` and
  the hero is parked in its starting state (`primeMainIntro()`) before the main
  screen is uncovered.
- **Hero photo.** The scroll parallax used to be created while the opening
  1.15→1 zoom was still running, so two tweens fought over `scale`. The
  parallax is now attached once the zoom finishes.
- **Couple names.** The script face has wide swashes, so the 0.5rem gap let the
  ampersand collide with the first name ("Sidharth&"). The gap is wider and the
  ampersand is optically centred, in the hero, the entry and the footer.
- Long name pairs now pick `--long` or `--col` automatically, so they stack
  instead of overflowing. Those classes existed but were never applied.
- Fixed a dead selector (`.rp-venue__chip` → `.rp-venue__chips .rp-chip`) that
  logged a GSAP warning on every load.

## Caching

`server/index.js` served everything except HTML with
`max-age=31536000, immutable` — including `app.js`, `app.css` and
`data/config.json`. Once a browser had visited, no edit ever reached it. Only
`/uploads/` and `/assets/fonts/` are cached that way now; everything else
revalidates. `netlify.toml` gained matching headers.

## Known issue, not fixed

`netlify/functions/rsvp.mjs` drops `adults`, `children` and the selected events
from each RSVP before storing it — the local Node server keeps them. Guests'
event selections are therefore lost on the Netlify deployment. Left alone as it
is outside this round of fixes.

---

## Addendum — RSVP replies (the "known issue" above, now fixed)

`netlify/functions/rsvp.mjs` rebuilt each reply from scratch and kept only
`name`, `guests`, `message` and `attendance`. The adult/child split and the
ceremonies each guest selected were discarded before the reply was stored, so
on the Netlify deployment they were gone for good. Its `guests` value was also
capped at 10, while the form allows up to 8 adults + 5 children = 13, so large
parties were silently under-counted.

Now stored: `name`, `adults`, `children`, `guests` (computed from the split,
not trusted from the client), `events`, `message`, `attendance`, `createdAt`.
Values are clamped to the ranges the form offers, a reply with no name is
rejected, and a malformed `events` value falls back to an empty list.

`server/index.js` previously wrote the request body to disk with no validation
at all (`{...data, createdAt}`). It now runs the same `normalizeRsvp()` rules,
so a reply is recorded identically whether the site runs locally or on Netlify
— verified by running both implementations over the same inputs.

The editor's guest list never displayed any of this even when it was stored.
It now shows a summary line (replies, how many are attending, total head count,
counting only those attending) and, per reply, the adult/child breakdown and
the ceremonies chosen. Replies saved before this change have no `adults` field
and fall back to showing the plain guest total.

---

## Addendum 2 — gallery photos were cropped

Every gallery tile was locked to `aspect-ratio: 4/5` with `object-fit: cover`,
so any photo that was not exactly 4:5 had its edges cut off. Measured on the
stock gallery:

| Layout | Worst photo visible |
|---|---|
| Phone, 2 columns | 53% |
| Desktop, 6-column grid with spans | **30%** |

Landscape shots suffered most — the 6-column desktop grid made some tiles
almost square, so a 3:2 photo lost nearly half its width, and the `nth-child`
spans made the first and fourth tiles worse still.

The gallery is now a masonry layout: CSS columns (2 on phones, 3 from 768px,
4 from 1080px) with `break-inside: avoid`, and each tile takes its own photo's
aspect ratio — `app.js` reads `naturalWidth`/`naturalHeight` as each image
loads and sets it inline. `aspect-ratio: 4/5` stays in CSS only to reserve
space until the real shape is known. Every photo now renders at 100% on phone,
tablet and desktop, whatever its shape, and the columns stay gap-free.

The lightbox was already correct (`object-fit: contain`) and still opens the
right photo.

---

## Addendum 3 — clipped names and phone lag

### The last letter of a name was cut off

Reported on an iPhone with "Pavan & Bhargavi": the final "i" was missing.
Measured at 393px, the names row ended at x=392 in a 393px viewport — and
Great Vibes overhangs its glyph boxes, so the swash on that last letter fell
outside `.rp-hero`'s `overflow:hidden` and disappeared.

The cause was my own `nameFitClass()` from the previous round: it chose a size
from **letter counts**. "Pavan"(5) + "Bhargavi"(8) = 13, under every threshold,
so nothing shrank. Letter counts cannot predict width in a script face, where
a swashed "B" is several times the width of an "i".

`fitNames()` now measures the rendered names against the container, leaves
18px each side for the swashes, and scales `--rp-name-scale` down smoothly
until they fit — stacking the two names only when side-by-side would have to
go below 72%. It runs after `document.fonts.ready` (the first measurement
would otherwise be of the fallback face), and again on resize and orientation
change. The entry and footer names are scaled the same way.

Checked across phone widths with the reported pair, nothing clipped:

| Viewport | Layout | Name size |
|---|---|---|
| 320px | stacked | 41px |
| 360px | side by side | 45px |
| 375px | side by side | 47px |
| 393px | side by side | 51px |
| 430px | side by side | 57px |

Long pairs such as "Bhanu Prakash & Vijaya Lakshmi" and
"Venkateswarlu & Satyanarayanamma" stack automatically and also stay clear of
the edges.

### The page stuttered on phones

Measured on the stock page: **~147MB of decoded image memory** (36.7
megapixels across 31 images) with **113 tweens** running. Gallery photos were
arriving up to 2560px wide to be displayed at 178px — a 11.5× waste in both
download and memory. That is far past what an iPhone keeps resident, so Safari
thrashes and drops frames.

| | Before | After |
|---|---|---|
| Decoded image memory at first paint | 147MB | **23MB** |
| Megapixels at first paint | 36.7 | **5.8** |
| Rain petals on phones | 50 | **18** |
| Bloom-burst petals on phones | 26 | **14** |

- Gallery photos and the events/footer backgrounds now use `loading="lazy"`
  and `decoding="async"`; 123MB of image memory is deferred until the guest
  actually scrolls to it. Verified cold-cache: nothing below the fold is
  fetched until it is approached.
- Entry and hero photos stay eager with `fetchpriority="high"` — they are the
  first thing anyone sees.
- The petal rain and bloom burst are thinned on small screens, on devices
  reporting 4 cores or fewer, and when Data Saver is on.
- The hero photo's scroll parallax and the mandala rotation are skipped on
  phones. Rescaling a full-screen photo on every scroll frame was the single
  most expensive thing on the page there; the content fade is kept.

Note: photos uploaded through the editor are already resized to 1920px by the
V24 upload fix. The oversized ones measured here came from hosted URLs set
before that, so re-uploading those through the editor will shrink them further.
