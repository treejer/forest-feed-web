export function formatUrl(url?: string) {
  return url ? url?.replace(/\/$/, '') : '';
}
