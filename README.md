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

Deploy the existing GitHub repository to a Vercel personal account on the free Hobby plan.

The root `vercel.json` publishes `dist/` directly, with no framework, dependency installation, or build command. Import the repository with its root directory left at the repository root and use `main` as the production branch. Keep the Vercel GitHub integration connected so pushes to `main` automatically redeploy production.

The site has no ChatGPT authentication. Leave production deployment protection disabled to allow recruiters to view it without logging in. The previous ChatGPT-hosted site is https://laraib-nadeem-folio-26.tdrmnjprr8.chatgpt.site.

Third-party libraries, fonts, and images retain their respective licenses. Tommy's included demo font is for personal use; see `font-licenses/tommy.txt`.
