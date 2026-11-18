# Laraib Nadeem — Portfolio

A phone-first portfolio with a 3D mushroom cottage, animated name sign, bird delivery, pastel dot-matrix flowers, and an interactive study.

## Preview locally

No build step or package installation is required. Serve the static site with:

```sh
python3 -m http.server 3000 --directory dist
```

Open http://localhost:3000. The phone-sized preview is at http://localhost:3000/phone.html.

## Structure

- `dist/index.html`: welcome page, study, and document templates
- `dist/assets/`: styles, animations, Three.js scenes, fonts, and images
- `dist/resume.html`: direct résumé page
- `dist/resume.pdf`: downloadable résumé
- `font-licenses/`: supplied font license information

The welcome page is the current completed design. The study is the existing version, awaiting its phone-first redesign.

## Hosting

Public website: https://portfolio-website-nadeeml-1884.vercel.app

Hosted on Vercel Hobby. Pushes to `main` automatically publish a new production deployment.

Deploy the existing GitHub repository to a Vercel personal account on the free Hobby plan.

The root `vercel.json` publishes `dist/` directly, with no framework, dependency installation, or build command. Import the repository with its root directory left at the repository root and use `main` as the production branch. Keep the Vercel GitHub integration connected so pushes to `main` automatically redeploy production.

The site has no ChatGPT authentication. Leave production deployment protection disabled to allow recruiters to view it without logging in. The previous ChatGPT-hosted site is https://laraib-nadeem-folio-26.tdrmnjprr8.chatgpt.site.

Third-party libraries, fonts, and images retain their respective licenses. Tommy's included demo font is for personal use; see `font-licenses/tommy.txt`.

## Character model

`dist/assets/models/laraib-tomodachi.glb` is the custom 3D character built from Laraib’s supplied front and side references. This earlier custom model is retained as an optional asset. The study currently displays an image-based Tomodachi character with her laptop instead.

### Portfolio assistant

The study has a headphone Smiski with a compact question bar beneath the room and an opt-in AI chat panel (`dist/assets/assistant.*`). The Vercel Function at `api/chat.js` uses AI SDK and the direct Google Gemini API (`gemini-3.5-flash-lite`); no API key is shipped to the browser. It answers from `api/portfolio-context.js`, extracted from the published résumé, and returns only allowlisted navigation links. Update that context when editing the résumé. Chat history is held in the page’s memory and sent to the inference service with each question; this application does not persist transcripts.

Run `npm ci` and `npm test` for the API validation checks. Vercel installs dependencies and serves `dist` alongside `/api/chat`. Save `GOOGLE_GENERATIVE_AI_API_KEY` as a sensitive Production environment variable in Vercel (Preview only if desired). Keep the Google project on its free tier with billing disabled to avoid inference charges. Free access and quotas depend on Google’s current eligibility and limits. No Vercel AI Gateway credits or payment verification are needed. When Google rejects a request or its quota is exhausted, the panel shows an honest error and direct résumé/project links.

Requests are bounded to 10 messages, 1,200 characters per message, 700 output tokens, and a 23-second inference timeout. The in-memory 12-request/minute burst limit is per function instance, not a globally durable spending cap. Keep paid billing disabled in Google AI Studio to stay within free quotas. No browsing, write actions, or personal-data collection tools are attached.

### Local design mode

Open `/?edit=1#inside` to move, resize, rotate and tilt page elements and 3D objects. Select an item in the panel, or click an object. Corner handles resize (hold Shift for non-uniform width/height); the handle above the selection rotates. The Drag action menu also supports resize, rotation and X/Y tilt. Numeric fields control position, independent width/height/depth, and rotation on each axis. Page elements include layering controls; visibility and reset controls are available for all elements.

The grass doodle layer and Ladybug 1–2 are individually editable. “Inner house 1” transforms the entire 3D scene. Furniture, wall frames, character, figurines, flowers, question bar components, navigation icons/arrows and headings have separate entries. Enable “Show every 3D piece” to edit individual meshes such as house structural pieces. Selecting an item from the menu locks it for dragging; “Auto-select by clicking” unlocks selection. Uncheck “Editing enabled” to preview normal interactions. Collapse the panel to get it out of the way.

Changes auto-save locally under `laraib-placement-v1`, separately for phone (<768px) and desktop, and apply only with `edit=1` present. Older translation-only files migrate automatically. Export/import JSON to move layouts between browsers or submit them for publication. The editor cannot publish or write to the server; normal visitors keep the published layout. Use the browser’s responsive viewport for phone previews. Undo and reset affect only local edits.

Published owner placements live in `dist/assets/published-layout.js` and its matching CSS. The desktop preset comes from the exported layout; the empty phone preset preserves the phone design. The local editor starts with this published preset when no local edits exist. Sparse hand-drawn grass tufts decorate a few garden areas behind the transparent 3D room, while ladybugs crawl above it and respect Pause and reduced-motion settings.

Two larger ladybugs follow separate smooth zigzag loops in the upper and lower garden. Mesh-projected bounds keep their paths outside the house, and the SVG sits behind the transparent 3D canvas as an additional safeguard. Paths adapt to panel dimensions and stay clear of the bottom question bar.

### Responsive layouts

`dist/assets/responsive-layout.css` leaves widths below 768px on the existing phone layout, expands stacked tablet layouts at 768px, and uses side-by-side welcome/study compositions from 1024px. Both 3D renderers resize automatically with their containers. Short screens can scroll rather than losing controls. All layouts share the same pages and URLs.

### Background music

“Local Forecast - Slower” by Kevin MacLeod is bundled under CC BY 4.0; the exact source, ISRC and license are in `dist/assets/audio/CREDITS.txt`. The MP3 was transcoded to 128 kbps. Visible credits appear on the welcome page, in study credits, and on the résumé page. Playback is opt-in, loops at 10% volume, and uses `preload=none` before activation. The toggle preference is stored locally, while playback time is stored for the current browser session and restored across pages. Browsers may require another gesture to resume after navigation; the music toggle remains available on every main page.
