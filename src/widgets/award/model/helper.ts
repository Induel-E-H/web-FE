const awardImages = import.meta.glob<string>('../assets/*.png', {
  eager: true,
  import: 'default',
});

export function getAwardImage(id: number): string {
  const key = `../assets/${id}.png`;
  const image = awardImages[key];
  if (!image) {
    throw new Error(`Award image not found for id: ${id}`);
  }
  return image;
}

export function wrapPage(page: number, totalPages: number) {
  return ((page % totalPages) + totalPages) % totalPages;
}
