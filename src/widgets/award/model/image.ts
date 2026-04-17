const awardImages = import.meta.glob<string>(
  '/src/entities/award/assets/*.webp',
  {
    eager: true,
    import: 'default',
  },
);

export function getAwardImage(id: number): string {
  const key = `/src/entities/award/assets/${id}.webp`;
  const image = awardImages[key];
  if (!image) {
    console.warn(`[award] image not found for id: ${id}`);
    return '';
  }
  return image;
}
