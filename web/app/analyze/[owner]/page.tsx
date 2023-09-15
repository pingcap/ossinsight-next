import { redirect, notFound } from 'next/navigation';
import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import SectionTemplate from '@/components/Analyze/Section';
import { fetchOrgInfo } from '@/app/analyze/[owner]/fetchOwner';
import Content from '@/app/analyze/[owner]/content';

export default async function Page({ params }: { params: { owner: string } }) {
  const data = await fetchOrgInfo(params.owner);

  return (
    <AnalyzeOrgContextProvider data={data}>
      <OrgAnalyzePageHeader />
      <Content />
    </AnalyzeOrgContextProvider>
  );
}
