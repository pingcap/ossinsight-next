import { AnalyzeOrgContextProps } from '@/components/Context/Analyze/AnalyzeOrg';

import { getOrgInfo } from '@/components/Analyze/utils';
import { notFound } from 'next/navigation';

export const fetchOrgInfo = async (
  orgName: string
): Promise<AnalyzeOrgContextProps> => {
  try {
    const orgDatas = await getOrgInfo(orgName);
    const orgData = orgDatas[0];
    if (!orgData) {
      throw new Error('org not found');
    }
    return {
      orgName: orgData.login,
      orgId: orgData.id,
    };
  } catch (error) {
    notFound();
  }
};
