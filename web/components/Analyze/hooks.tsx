'use client';
import * as React from 'react';

import { getOrgOverview, getUserInfo } from '@/components/Analyze/utils';

export interface OrgOverviewDataProps {
  participants: number;
  stars: number;
  repos: number;
  bio: string;
  last_participated_at: string;
  
}

export function useOrgOverview(id?: number, name?: string) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<OrgOverviewDataProps | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchOrgOverview = async (id: number, name: string) => {
      try {
        setLoading(true);
        const data = await getOrgOverview(id);
        const userData = await getUserInfo(name);
        setData({ ...data[0], repos: userData.public_repos, bio: userData.bio });
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
  };
}
