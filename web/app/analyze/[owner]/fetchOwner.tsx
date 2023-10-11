import { getOwnerInfo } from '@/components/Analyze/utils';
import { notFound } from 'next/navigation';

export const fetchOwnerInfo = async (
  orgName: string,
) => {
  try {
    return await getOwnerInfo(orgName);
  } catch (error) {
    notFound();
  }
};
