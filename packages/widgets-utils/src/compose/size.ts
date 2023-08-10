export function autoSize (ctx: { runtime: 'client' | 'server', dpr: number }, size: number) {
  if (ctx.runtime === 'client') {
    return size;
  } else {
    return size * ctx.dpr;
  }
}