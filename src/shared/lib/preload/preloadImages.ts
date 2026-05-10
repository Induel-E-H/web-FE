const preloaded = new Set<string>();

export function preloadImages(urls: (string | undefined)[]): void {
  for (const url of urls) {
    if (!url || preloaded.has(url)) continue;
    preloaded.add(url);
    const img = new Image();
    img.src = url;
  }
}
