import {version} from 'package.json';
export function versionToNumber(versionWithDot: string) {
  return Number(versionWithDot.split('-')[0].split('.').join(''));
}

export function checkUserVersion(userVersion: string) {
  return versionToNumber(userVersion) < versionToNumber(version);
}
