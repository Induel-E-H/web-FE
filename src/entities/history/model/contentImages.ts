const thumbnailImages = import.meta.glob(
  '/src/entities/history/assets/content/*/0.webp',
  { eager: true, import: 'default' },
);

const contentImageModules = import.meta.glob<string>(
  '/src/entities/history/assets/content/*/*.webp',
  { import: 'default' },
);

export function getThumbnailImage(index: number): string | undefined {
  const src =
    thumbnailImages[`/src/entities/history/assets/content/${index}/0.webp`];
  return typeof src === 'string' ? src : undefined;
}

export async function getAllContentImages(index: number): Promise<string[]> {
  const loaders: Promise<string>[] = [];
  let i = 0;
  while (true) {
    const loader =
      contentImageModules[
        `/src/entities/history/assets/content/${index}/${i}.webp`
      ];
    if (!loader) break;
    loaders.push(loader());
    i++;
  }
  return Promise.all(loaders);
}
