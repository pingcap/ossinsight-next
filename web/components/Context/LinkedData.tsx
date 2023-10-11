'use client';

import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createContext } from 'react';

export const LinkedDataContext = createContext<LinkedData>({
  repos: {},
  users: {},
  collections: {},
  orgs: {},
});

