# Ambient audio

Drop a licensed ambient/synthwave track at `ambient.mp3` in this directory.

## Phase A placeholder

No track is shipped. The `<AmbientAudio>` component probes for this file on
mount — if it's missing, the toggle button goes into a disabled "no track"
state. You won't see errors.

## Phase B

Replace this README with a real MP3. Recommended specs:

- loopable (the component sets `loop = true`)
- 96-128 kbps (the site is bandwidth-sensitive; no need for HQ)
- under 3 minutes (longer files inflate the first-paint budget)
- licensed for commercial use (document the license in `/brand/licenses.md`)

Free-tier candidates to audition:

- **Pixabay music** (CC0, no attribution required)
- **Artlist** (paid, but clean licensing for app/video use)
- **Silvermansound.com** (CC-BY)

Ghost picks. Reel cuts.
