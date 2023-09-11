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
  period?: 'past_28_days' | 'past_90_days' | 'past_12_months';
  // orgInfo?: OrgInfo;
}

export const AnalyzeOrgContext = createContext<AnalyzeOrgContextProps>({
  orgName: '',
  orgId: undefined,
  period: 'past_28_days',
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
