# Priya & Arjun Wedding — v18

## v18 fixes
- Wedding date in Admin is now correctly loaded into the `datetime-local` input.
- Changing the Wedding date automatically updates the Display date line.
- The public hero, venue, footer and share text derive their displayed date from `weddingDate`, so the date stays synchronized across sections.
- Music control now has a visible animated equalizer while music is playing and stops animating immediately when Sound Off is clicked.
- Event dates remain independently editable in the Schedule section.

## Local server
```bash
node server/index.js
```
Open `http://localhost:3000/` and `http://localhost:3000/admin.html`.

## Music button state
- Music playing: **SOUND ON**
- Music stopped/paused: **SOUND OFF**
- The equalizer animation runs only while music is playing.
