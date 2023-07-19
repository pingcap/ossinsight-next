import { RemoteRepoInfo } from '@ossinsight/ui';
import { createContext } from 'react';

export interface ParametersContextValues {
  reposCache: Record<number, RemoteRepoInfo>;
}

export const ParametersContext = createContext<ParametersContextValues>({
  reposCache: {},
});
