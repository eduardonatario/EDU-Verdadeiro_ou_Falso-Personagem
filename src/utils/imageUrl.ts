/**
 * Utility functions for robust image URL handling, normalization,
 * proxy fallback to bypass CORS/hotlinking, and quick sample images.
 */

export interface SampleImage {
  label: string;
  url: string;
  category: string;
}

export const EDUCATIONAL_SAMPLE_IMAGES: SampleImage[] = [
  {
    label: 'Camadas da Terra (Manto & Núcleo)',
    url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    category: 'Geociências',
  },
  {
    label: 'Sol & Sistema Solar',
    url: 'https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?auto=format&fit=crop&w=1200&q=80',
    category: 'Astronomia',
  },
  {
    label: 'Grande Muralha da China',
    url: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    category: 'História',
  },
  {
    label: 'Polvo no Oceano (Vida Marinha)',
    url: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=1200&q=80',
    category: 'Biologia',
  },
  {
    label: 'Cérebro & Neurociência',
    url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80',
    category: 'Ciência',
  },
  {
    label: 'Célula Microscópica',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    category: 'Biologia',
  },
  {
    label: 'Floresta & Natureza',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
    category: 'Ecologia',
  },
];

/**
 * Normalizes user-entered image URLs:
 * - Detects Google Drive sharing links and transforms them to direct image endpoints.
 * - Detects Wikimedia Commons and Wikipedia file pages and converts them to direct Special:FilePath.
 * - Detects Unsplash photo pages and converts them to direct images.unsplash.com CDN.
 * - Detects Dropbox links and appends raw=1.
 * - Detects Imgur webpage links and converts them to direct i.imgur.com images.
 * - Extracts Google Image search target URLs if copied from search results.
 * - Upgrades insecure http:// to https:// to prevent browser mixed content blocking.
 */
export function normalizeImageUrl(inputUrl: string): string {
  if (!inputUrl) return '';
  let url = inputUrl.trim();

  // Strip wrapping quotes or angle brackets if pasted
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }
  if (url.startsWith('<') && url.endsWith('>')) {
    url = url.slice(1, -1).trim();
  }

  // Google Images / Google search redirect URLs
  if (url.includes('google.com/imgres') || url.includes('google.com/url')) {
    try {
      const parsed = new URL(url);
      const target = parsed.searchParams.get('imgurl') || parsed.searchParams.get('url');
      if (target) return normalizeImageUrl(decodeURIComponent(target));
    } catch {
      // ignore
    }
  }

  // Google Drive: file/d/ID/view or open?id=ID or uc?id=ID
  const driveFileMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?.*id=)([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    const fileId = driveFileMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // Wikimedia Commons File page: https://commons.wikimedia.org/wiki/File:FILENAME
  // or Wikipedia: https://en.wikipedia.org/wiki/File:FILENAME or pt.wikipedia.org/wiki/Ficheiro:FILENAME
  const wikiFileMatch = url.match(/(?:commons\.wikimedia\.org|[a-z]+\.wikipedia\.org)\/wiki\/(?:File|Ficheiro|Arquivo):([^#?&]+)/i);
  if (wikiFileMatch && wikiFileMatch[1]) {
    const filename = decodeURIComponent(wikiFileMatch[1]);
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
  }

  // Unsplash photo page: https://unsplash.com/photos/([a-zA-Z0-9_-]+)
  const unsplashMatch = url.match(/unsplash\.com\/photos\/(?:[a-zA-Z0-9_-]+-)?([a-zA-Z0-9_-]{5,})/);
  if (unsplashMatch && unsplashMatch[1] && !url.includes('images.unsplash.com')) {
    return `https://images.unsplash.com/photo-${unsplashMatch[1]}?auto=format&fit=crop&w=1200&q=80`;
  }

  // Dropbox share link: convert ?dl=0 to ?raw=1
  if (url.includes('dropbox.com') && url.includes('dl=0')) {
    return url.replace('dl=0', 'raw=1');
  } else if (url.includes('dropbox.com') && !url.includes('raw=1')) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}raw=1`;
  }

  // Imgur page without file extension: https://imgur.com/ABC -> https://i.imgur.com/ABC.jpg
  const imgurMatch = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch && imgurMatch[1] && !['a', 'gallery', 't'].includes(imgurMatch[1])) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  // Postimages viewer page: https://postimg.cc/ABC -> direct
  const postimgMatch = url.match(/postimg\.cc\/([a-zA-Z0-9]+)/);
  if (postimgMatch && postimgMatch[1] && !url.includes('i.postimg.cc')) {
    return `https://i.postimg.cc/${postimgMatch[1]}/image.jpg`;
  }

  // Ensure https if http (browsers block mixed content inside HTTPS applications)
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  return url;
}

/**
 * Returns a fallback proxy URL (using the free, fast, open-source images.weserv.nl proxy)
 * which bypasses hotlink prevention and CORS issues for web images.
 */
export function getProxyImageUrl(url: string): string {
  if (!url) return '';
  const clean = normalizeImageUrl(url);

  // Data URLs, Blobs, relative URLs and local imports don't need proxy
  if (
    clean.startsWith('data:') ||
    clean.startsWith('blob:') ||
    clean.startsWith('/') ||
    clean.startsWith('./') ||
    clean.startsWith('../')
  ) {
    return clean;
  }

  // If already proxied, return as is
  if (clean.includes('images.weserv.nl')) {
    return clean;
  }

  // Remove protocol for weserv
  const protocolStripped = clean.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(protocolStripped)}&default=${encodeURIComponent(clean)}`;
}

/**
 * Handles image error on <img> elements by attempting the proxy once.
 */
export function handleImageFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl: string
) {
  const target = e.currentTarget;
  if (!target || !originalUrl) return;

  const proxied = getProxyImageUrl(originalUrl);
  // Only attempt fallback once to prevent loops
  if (target.src !== proxied && !target.dataset.triedProxy) {
    target.dataset.triedProxy = 'true';
    target.src = proxied;
  }
}
