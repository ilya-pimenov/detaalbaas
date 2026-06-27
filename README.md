# De TaalBaas — website

Bilingual (🇳🇱 / 🇬🇧) marketing site for **De TaalBaas**, Tim's Dutch-language
training in Amsterdam. Built with [Astro](https://astro.build), styled with the
[shadcn/ui](https://ui.shadcn.com) design system (Tailwind tokens), edited with
[Decap CMS](https://decapcms.org), and hosted free on **GitHub Pages**.

- Dutch site: `/`
- English site: `/en/`
- Content editor: `/admin/`

---

## 1. Requirements

- [Node.js](https://nodejs.org) 20 or newer (`node -v`)
- [ffmpeg](https://ffmpeg.org) — only needed to compress new photos/videos
  (`brew install ffmpeg`)

## 2. Preview locally

```bash
cd Repo
npm install        # first time only
npm run dev        # → http://localhost:4321
```

`npm run dev` hot-reloads as you edit. To preview the exact production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built site
```

## 3. Edit content

All editable text, courses, reviews, videos, the word-of-the-week and photo
galleries live as JSON files under `src/data/`. You can edit those files
directly, **or** use the visual CMS:

### Option A — edit locally (no login)

```bash
# Terminal 1
npm run cms        # starts the Decap local backend on :8081
# Terminal 2
npm run dev
# then open http://localhost:4321/admin/  and click "Login"
```

Saving in the CMS writes straight to the files in `src/data/` and
`public/media/uploads/`. Commit those changes with git as usual.

### Option B — edit online (for Tim)

Requires a one-time OAuth setup — see **section 6**. Once configured, Tim opens
`https://detaalbaas.nl/admin/`, logs in with GitHub, and every save commits to
the repo, which automatically redeploys the site.

## 4. Media (photos & videos)

Compressed, web-ready media is already in `public/media/`. To add more, compress
first so pages stay fast:

```bash
scripts/optimize-media.sh photo ~/Desktop/IMG_1234.jpg public/media/photos/lesson-new.jpg
scripts/optimize-media.sh video ~/Desktop/clip.mov      public/media/videos/student-new.mp4
```

Then reference the new file from the CMS or the JSON data files. (The CMS image
picker also lets Tim upload directly; those land in `public/media/uploads/`.)

---

## 5. Deploy to GitHub Pages

You'll own the repo and add Tim as a collaborator later
(**Settings → Collaborators**).

1. **Create the repo & push.** From inside `Repo/`:

   ```bash
   git init
   git add .
   git commit -m "Initial De TaalBaas website"
   git branch -M main
   git remote add origin https://github.com/<your-user>/<your-repo>.git
   git push -u origin main
   ```

2. **Enable Pages via Actions.** On GitHub: **Settings → Pages → Build and
   deployment → Source = "GitHub Actions"**. The included workflow
   (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

3. **Custom domain `detaalbaas.nl`.** The repo already includes
   `public/CNAME` containing `detaalbaas.nl`. At your DNS provider add:

   | Type  | Name  | Value                                   |
   | ----- | ----- | --------------------------------------- |
   | A     | `@`   | `185.199.108.153`                       |
   | A     | `@`   | `185.199.109.153`                       |
   | A     | `@`   | `185.199.110.153`                       |
   | A     | `@`   | `185.199.111.153`                       |
   | CNAME | `www` | `<your-user>.github.io.`                |

   Then in **Settings → Pages → Custom domain** enter `detaalbaas.nl` and tick
   **Enforce HTTPS** (after the certificate is issued, ~15 min).

> **Not using a custom domain?** Delete `public/CNAME`, and in
> `astro.config.mjs` set `site: 'https://<user>.github.io'` and
> `base: '/<repo-name>'`. Push again.

After the first push, watch progress under the repo's **Actions** tab. The site
goes live at your domain (or `https://<user>.github.io/<repo>/`).

---

## 6. Online editing with Decap CMS (OAuth)

GitHub Pages is static — it can't run the server bit Decap needs to log a user
in with GitHub. The fix is a tiny, free OAuth proxy. You set this up **once**.

### 6a. Create a GitHub OAuth App

**GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**

- **Application name:** `De TaalBaas CMS`
- **Homepage URL:** `https://detaalbaas.nl`
- **Authorization callback URL:** the `/callback` URL of your proxy
  (from 6b, e.g. `https://detaalbaas-cms.<you>.workers.dev/callback`)

Note the **Client ID** and generate a **Client Secret**.

### 6b. Deploy an OAuth proxy (pick one)

- **Cloudflare Workers (recommended, free):**
  [`sterlingwes/decap-proxy`](https://github.com/sterlingwes/decap-proxy) — deploy
  with `wrangler`, set `GITHUB_OAUTH_ID` / `GITHUB_OAUTH_SECRET` as secrets.
- **Vercel / Netlify Functions:**
  [`decap-cms-oauth`](https://github.com/lon-yang/decap-cms-oauth-vercel) and
  similar one-click templates also work.

### 6c. Point the CMS at it

In `public/admin/config.yml` set:

```yaml
backend:
  name: github
  repo: <your-user>/<your-repo>     # e.g. ilya/de-taalbaas
  branch: main
  base_url: https://<your-proxy-url>   # the proxy's root URL (no /callback)
```

Commit & push. Now `https://detaalbaas.nl/admin/` shows **“Login with GitHub”**.
Add Tim as a repo collaborator and he can edit everything online; each save
triggers the deploy workflow above.

---

## 7. Project structure

```
Repo/
├─ public/
│  ├─ admin/              # Decap CMS (index.html + config.yml)
│  ├─ media/photos/       # compressed photos
│  ├─ media/videos/       # compressed videos + poster frames
│  ├─ CNAME               # custom domain
│  └─ favicon.svg
├─ src/
│  ├─ data/               # ← editable content (JSON, what the CMS writes)
│  │  ├─ settings/        #   nl.json / en.json — all site texts
│  │  ├─ courses/         #   one file per course
│  │  ├─ reviews/         #   one file per review
│  │  ├─ videos/          #   student video cards
│  │  ├─ words/           #   word of the week
│  │  └─ gallery/         #   photo galleries
│  ├─ components/         # shadcn-style UI + page sections
│  ├─ layouts/Base.astro
│  ├─ lib/content.ts      # loads + localises the data
│  └─ pages/              # index.astro (NL), en/index.astro (EN)
├─ scripts/optimize-media.sh
└─ .github/workflows/deploy.yml
```

## 8. Common tasks

| I want to…                    | Do this                                              |
| ----------------------------- | ---------------------------------------------------- |
| Change a heading or paragraph | edit `src/data/settings/nl.json` / `en.json`         |
| Add/Update a course           | add a file in `src/data/courses/` (or use the CMS)   |
| Add a review                  | add a file in `src/data/reviews/`                    |
| Swap the word of the week     | edit `src/data/words/soelaas.json` or add a new one  |
| Change brand colour           | edit `--primary` in `src/styles/globals.css`         |
| Add photos                    | compress with `scripts/optimize-media.sh`, reference them |
