import { ParameterDefinition } from '@ossinsight/widgets-types';
import parseActivityType from './activity-type';
import parseCollectionId from './collection-id';
import parseDate from './date';
import parseEventType from './event-type';
import parseRepoId from './repo-id';
import * as parseTime from './time';
import parseUserId from './user-id';

const parsers: Record<string, (value: string, config: ParameterDefinition) => unknown> = {
  'repo-id': parseRepoId,
  'user-id': parseUserId,
  'time-zone': parseTime.parseTimeZone,
  'time-period': parseTime.parseTimePeriod,
  'activity-type': parseActivityType,
  'collection-id': parseCollectionId,
  'event-type': parseEventType,
  'limit': parseUserId,
  'day': parseDate,
  'month': parseDate,
};

export default parsers;
