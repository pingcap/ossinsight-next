import { redirect, notFound } from 'next/navigation';
import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import { fetchOrgInfo } from '@/app/analyze/[org]/fetchOwner';
import Content from '@/app/analyze/[org]/content';

export default async function Page({ params }: { params: { org: string } }) {
  const data = await fetchOrgInfo(params.org);

  return (
    <AnalyzeOrgContextProvider data={data}>
      <OrgAnalyzePageHeader />
      <Content />
    </AnalyzeOrgContextProvider>
  );
}
