'use client';
import * as React from 'react';

import { getOrgOverview, getUserInfo } from '@/components/Analyze/utils';

export interface OrgOverviewDataProps {
  participants: number;
  stars: number;
  repos: number;
  bio: string;
}

export function useOrgOverview(id?: number, name?: string) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<OrgOverviewDataProps | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [finishedAt, setFinishedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchOrgOverview = async (id: number, name: string) => {
      try {
        setLoading(true);
        const res = await getOrgOverview(id);
        const userData = await getUserInfo(name);
        console.log(res, userData);
        const { finishedAt, data: dataArray } = res;
        const data = dataArray[0];
        setFinishedAt(new Date(finishedAt));
        setData({ ...data, repos: userData.public_repos, bio: userData.bio });
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    id && name && fetchOrgOverview(id, name);
  }, [id, name]);

  return {
    loading,
    data,
    error,
    finishedAt,
  };
}
