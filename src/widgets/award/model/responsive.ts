export const BREAKPOINTS = {
  mobile: 767,
  tablet: 1024,
} as const;

export function getItemsPerPage(): number {
  if (window.innerWidth <= BREAKPOINTS.mobile) return 4; // 2×2
  if (window.innerWidth <= BREAKPOINTS.tablet) return 6; // 3×2
  return 10; // 5×2
}
