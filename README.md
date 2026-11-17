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

### Local placement mode

Open `/?edit=1#inside` to drag page elements and 3D room objects. Choose an item in the panel, or click an object, then drag; arrow keys nudge and Shift increases the step. Selecting an item in the menu locks that selection until another menu selection or reload, which allows moving the whole panel or navigation group. Uncheck “Dragging enabled” to try normal interactions. Collapse the panel to get it out of the way.

Changes save in this browser's local storage under `laraib-placement-v1`, separately for phone (<768px) and desktop. They apply only while `edit=1` is present. Use a responsive viewport for phone previews. Export/import JSON to move placements between browsers or submit them for publication. The editor has no server write or publishing capability, and normal visitors receive the published layout. Undo/reset are local only.
