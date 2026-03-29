export function wrapPage(page: number, totalPages: number): number {
  return ((page % totalPages) + totalPages) % totalPages;
}
