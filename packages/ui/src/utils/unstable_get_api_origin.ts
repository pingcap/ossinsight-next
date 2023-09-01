export function unstable_getApiOrigin () {
  if (typeof location !== 'undefined') {
    return location.origin + '/unstable_proxy';
  } else {
    return 'https://api.ossinsight.io';
  }
}
