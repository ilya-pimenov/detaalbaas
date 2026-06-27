// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// ─────────────────────────────────────────────────────────────────────────────
// Deployment URL
// Custom domain (detaalbaas.nl): keep `site` below and leave `base` unset.
// If you instead deploy to https://<user>.github.io/<repo>/ , set:
//   site: 'https://<user>.github.io',
//   base: '/<repo-name>',
// and the CNAME file in /public can be deleted.
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
