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

The study has an opt-in AI chat panel (`dist/assets/assistant.*`). The Vercel Function at `api/chat.js` uses AI SDK and AI Gateway with deployment OIDC authentication; no API key is shipped to the browser. It answers from `api/portfolio-context.js`, extracted from the published résumé, and returns only allowlisted navigation links. Update that context when editing the résumé. Chat history is held in the page’s memory and sent to the inference service with each question; this application does not persist transcripts.

Run `npm ci` and `npm test` for the API validation checks. Vercel installs dependencies and serves `dist` alongside `/api/chat`. AI Gateway must be activated for the team and have available credits. Gateway may require payment-method verification even for complimentary credits; this does not change the website’s Hobby hosting plan. No automatic paid credit top-up is configured here. Without Gateway access, the panel shows a connection error and direct résumé/project links.

Requests are bounded to 10 messages, 1,200 characters per message, 700 output tokens, and a 23-second inference timeout. The in-memory 12-request/minute burst limit is per function instance, not a globally durable spending cap. Before opening the assistant to heavy traffic, configure a project budget in AI Gateway. No browsing, write actions, or personal-data collection tools are attached.
