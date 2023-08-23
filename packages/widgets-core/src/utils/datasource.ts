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
