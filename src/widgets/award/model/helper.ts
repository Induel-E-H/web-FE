const awardImages = import.meta.glob<string>('../assets/*.png', {
  eager: true,
  import: 'default',
});

export function getAwardImage(id: number): string {
  return awardImages[`../assets/${id}.png`];
}
