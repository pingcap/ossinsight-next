import Content from '@/app/analyze/[owner]/content';
import { fetchOwnerInfo } from '@/app/analyze/[owner]/fetchOwner';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import AnalyzeOrgContextProvider from '@/components/Context/Analyze/AnalyzeOrg';
import { notFound, redirect } from 'next/navigation';

export default async function Page ({ params }: { params: { owner: string } }) {
  const data = await fetchOwnerInfo(decodeURIComponent(params.owner));
  if (data.type === 'Organization') {
    return (
      <AnalyzeOrgContextProvider
        data={{
          orgName: data.login,
          orgId: data.id,
        }}
      >
        <OrgAnalyzePageHeader />
        <Content />
      </AnalyzeOrgContextProvider>
    );
  } else {
    redirect(`https://ossinsight.io/analyze/${params.owner}`);
  }
}
