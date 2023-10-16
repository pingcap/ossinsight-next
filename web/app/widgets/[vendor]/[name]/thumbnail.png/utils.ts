import { WidgetBaseContext } from '@ossinsight/widgets-types';

const DAYS = 1000 * 60 * 60 * 24;

/**
 * Get `Expires` fields from all responses. If any response was empty, returns null.
 * @param ctx
 * @param maxDays set the max expires days.
 */
export function computeExpired (ctx: WidgetBaseContext, maxDays = 1) {
  if (ctx.httpResponses?.length === 0) {
    return null;
  }

  return ctx.httpResponses?.reduce((date: Date | null, response) => {
    const e = response.headers.get('Expires');
    if (e) {
      const newDate = new Date(e);
      if (date) {
        if (newDate < date) {
          return newDate;
        } else {
          return date;
        }
      }
      return null;
    }
    return null;
  }, new Date(Date.now() + maxDays * DAYS));
}