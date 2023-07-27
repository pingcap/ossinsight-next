import parseRepoId from './repo-id';
import * as parseTime from './time';

const parsers: Record<string, (value: string) => unknown> = {
  'repo-id': parseRepoId,
  'user-id': parseRepoId,
  'time-zone': parseTime.parseTimeZone,
  'time-period': parseTime.parseTimePeriod,
};

export default parsers;
