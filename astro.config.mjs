// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// ─────────────────────────────────────────────────────────────────────────────
// Deployment URL
//
// CURRENT: previewing on GitHub Pages at https://ilya-pimenov.github.io/detaalbaas/
//
// To switch to the custom domain detaalbaas.nl later:
//   1. set `site: 'https://detaalbaas.nl'` and remove the `base` line below
//   2. restore the CNAME file:  echo 'detaalbaas.nl' > public/CNAME
//   3. set the custom domain in repo Settings → Pages
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  site: 'https://ilya-pimenov.github.io',
  base: '/detaalbaas',
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
