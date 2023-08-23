export * as prettyMs from 'pretty-ms';

export function upBound(num: number): number {
  if (num === 0) {
    return 0;
  }

  const sign = Math.sign(num);
  const mag = Math.abs(num);

  let base = 1;
  while (mag > base) {
    base *= 10;
  }
  base /= 20;

  return (Math.floor(mag / base) + 1) * base * sign;
}

/**
 *
 * @param sw Source width
 * @param sh Source height
 * @param tw Target container width
 * @param th Target container height
 */
export function scaleToFit (sw: number, sh: number, tw: number, th: number): { width: number, height: number } {
  let width = tw;
  let height = tw * sh / sw;
  if (height > th) {
    width *= th / height;
    height = th;
  }

  return { width, height };
}

export function isEmptyData (datasource: any) {
  if (datasource == null) {
    return true;
  }
  if (typeof datasource !== 'object') {
    return false;
  }
  if (datasource instanceof Array) {
    if (datasource.length === 0) {
      return true;
    }
    // if any sub data is not empty, the datasource is not empty.
    return datasource.findIndex(sub => !isEmptyData(sub)) === -1;
  }
  return false;
}
