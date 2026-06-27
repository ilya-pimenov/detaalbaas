// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// ─────────────────────────────────────────────────────────────────────────────
// Deployment URL — custom domain detaalbaas.nl (served from the domain root).
//
// To go back to a github.io/<repo>/ preview:
//   1. set `site: 'https://ilya-pimenov.github.io'` and add `base: '/detaalbaas'`
//   2. remove public/CNAME
//   3. clear the custom domain in repo Settings → Pages
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://detaalbaas.nl',
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false, // NL at "/", EN at "/en/"
    },
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
