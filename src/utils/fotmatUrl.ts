export default function formatUrl(url?: string) {
  return url ? url?.replace(/\/$/, '') : '';
}
