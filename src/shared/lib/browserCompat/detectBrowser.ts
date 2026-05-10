export type BrowserSupport = 'full' | 'limited' | 'unsupported';

function getChromeVersion(ua: string): number | null {
  if (
    ua.includes('Edg/') ||
    ua.includes('OPR/') ||
    ua.includes('SamsungBrowser/')
  ) {
    return null;
  }
  const match = ua.match(/Chrome\/(\d+)/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

export function getBrowserSupport(ua = navigator.userAgent): BrowserSupport {
  const version = getChromeVersion(ua);
  if (version === null) return 'full';
  if (version < 80) return 'unsupported';
  if (version < 90) return 'limited';
  return 'full';
}
