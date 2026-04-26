export function lockScroll() {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${scrollbarWidth}px`,
  );
  document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  document.body.style.overflow = '';
  document.documentElement.style.removeProperty('--scrollbar-width');
}
