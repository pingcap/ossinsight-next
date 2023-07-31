import parseRepoId from './repo-id';
import parseUserId from './user-id';
import parseCollectionId from './collection-id';
import parseActivityType from './activity-type';
import * as parseTime from './time';

const parsers: Record<string, (value: string) => unknown> = {
  'repo-id': parseRepoId,
  'user-id': parseUserId,
  'time-zone': parseTime.parseTimeZone,
  'time-period': parseTime.parseTimePeriod,
  'activity-type': parseActivityType,
  'collection-id': parseCollectionId,
};

export default parsers;
