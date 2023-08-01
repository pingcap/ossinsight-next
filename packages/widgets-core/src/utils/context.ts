import { LinkedDataContext } from '@ossinsight/widgets-types';
import { generateZoneOptions, PERIOD_OPTIONS } from '@ossinsight/widgets-utils/src/ui';
import * as colors from 'tailwindcss/colors';
import { LinkedData } from '../parameters/resolver';

export function createWidgetBaseContext<P extends Record<string, string>> (runtime: 'client' | 'server', parameters: P) {
  return {
    runtime,
    parameters,
  };
}

export function createWidgetContext<P extends Record<string, string>> (runtime: 'client' | 'server', parameters: P, linkedData: LinkedData) {
  return {
    ...createWidgetBaseContext(runtime, parameters),
    ...createLinkedDataContext(linkedData),
    theme: { colors },
    getTimeParams (): any {
      const { DEFAULT_ZONE } = generateZoneOptions();

      return {
        zone: parameters?.zone || DEFAULT_ZONE,
        period: parameters?.period || PERIOD_OPTIONS[0],
      };
    },
  };
}

export function createLinkedDataContext (linkedData: LinkedData): LinkedDataContext {
  return {
    getRepo (id: number): any {
      return linkedData.repos[String(id)];
    },
    getUser (id: number): any {
      return linkedData.users[String(id)];
    },
    getCollection (id: number): any {
      return linkedData.collections[String(id)];
    },
    getOrg (id: number): any {
      return {};
    },
  };
}