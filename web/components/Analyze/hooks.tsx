'use client';
import * as React from 'react';

import { getOrgOverview } from '@/components/Analyze/utils';

export interface OrgOverviewDataProps {
  participants: number;
  stars: number;
}

export function useOrgOverview(id?: number) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<OrgOverviewDataProps | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [finishedAt, setFinishedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchOrgOverview = async (id: number) => {
      try {
        setLoading(true);
        const res = await getOrgOverview(id);
        const { finishedAt, data: dataArray } = res;
        const data = dataArray[0];
        setFinishedAt(new Date(finishedAt));
        setData(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    id && fetchOrgOverview(id);
  }, [id]);

  return {
    loading,
    data,
    error,
    finishedAt,
  };
}
