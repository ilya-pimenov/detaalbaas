// Loads editable content from src/data (the same files Decap CMS writes to).
// Folder collections are read with import.meta.glob; singletons are imported directly.

import nlSettings from '../data/settings/nl.json';
import enSettings from '../data/settings/en.json';
import gallery from '../data/gallery/gallery.json';

export type Lang = 'nl' | 'en';

export type Settings = typeof nlSettings;

export function getSettings(lang: Lang): Settings {
  return lang === 'en' ? (enSettings as Settings) : (nlSettings as Settings);
}

export function getGallery() {
  return gallery;
}

function loadCollection<T extends { order?: number }>(
  modules: Record<string, unknown>
): T[] {
  return Object.values(modules)
    .map((m) => m as T)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export interface Course {
  order: number;
  active: boolean;
  title_nl: string;
  title_en: string;
  level: string;
  day_nl: string;
  day_en: string;
  startDate: string;
  time: string;
  hours_nl: string;
  hours_en: string;
  price: string;
  enrollUrl: string;
}

export interface Review {
  order: number;
  name: string;
  role: string;
  date: string;
  language: Lang;
  quote: string;
}

export interface StudentVideo {
  order: number;
  student: string;
  title_nl: string;
  title_en: string;
  caption_nl: string;
  caption_en: string;
  video: string;
  poster: string;
}

export interface Word {
  active: boolean;
  date: string;
  word: string;
  meaning_nl: string;
  meaning_en: string;
  etymology_nl: string;
  etymology_en: string;
  exampleNl: string;
  exampleEn: string;
}

export function getCourses(): Course[] {
  return loadCollection<Course>(
    import.meta.glob('../data/courses/*.json', { eager: true, import: 'default' })
  ).filter((c) => c.active);
}

export function getReviews(): Review[] {
  return loadCollection<Review>(
    import.meta.glob('../data/reviews/*.json', { eager: true, import: 'default' })
  );
}

export function getVideos(): StudentVideo[] {
  return loadCollection<StudentVideo>(
    import.meta.glob('../data/videos/*.json', { eager: true, import: 'default' })
  );
}

export function getWord(): Word | undefined {
  const words = loadCollection<Word & { order?: number }>(
    import.meta.glob('../data/words/*.json', { eager: true, import: 'default' })
  ).filter((w) => w.active);
  // newest by date
  return words.sort((a, b) => (a.date < b.date ? 1 : -1))[0];
}

// Localisation helpers ────────────────────────────────────────────────────────

export function pick<T>(lang: Lang, nl: T, en: T): T {
  return lang === 'en' ? en : nl;
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(lang === 'en' ? 'en-GB' : 'nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// URL helper that respects astro's configured base path.
export function localizedHome(lang: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return lang === 'en' ? `${base}/en/` : `${base}/`;
}
