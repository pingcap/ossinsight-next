export function unstable_getApiOrigin () {
  if (typeof location !== 'undefined' && location.port !== '6006' /* storybook */) {
    return location.origin + '/unstable_proxy';
  } else {
    return 'https://api.ossinsight.io';
  }
}
