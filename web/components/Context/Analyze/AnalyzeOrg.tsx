'use client';
import {
  createContext,
  MutableRefObject,
  RefCallback,
  useContext,
} from 'react';

// TODO - add orgInfo
export interface AnalyzeOrgContextProps {
  orgName: string;
  orgId?: number;
  // orgInfo?: OrgInfo;
}

export const AnalyzeOrgContext = createContext<AnalyzeOrgContextProps>({
  orgName: '',
  orgId: undefined,
  // orgInfo: undefined,
});

// https://nextjs.org/docs/getting-started/react-essentials#context
export default function AnalyzeOrgContextProvider({
  children,
  data,
}: {
  children?: React.ReactNode;
  data: AnalyzeOrgContextProps;
}) {
  return (
    <AnalyzeOrgContext.Provider value={data}>
      {children}
    </AnalyzeOrgContext.Provider>
  );
}
