import Content from '@/app/analyze/[owner]/content';
import { fetchOwnerInfo } from '@/app/analyze/[owner]/fetchOwner';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import AnalyzeOwnerContextProvider from '@/components/Context/Analyze/AnalyzeOwner';
import { notFound, redirect } from 'next/navigation';

export default async function Page ({ params }: { params: { owner: string } }) {
  const data = await fetchOwnerInfo(decodeURIComponent(params.owner));
  if (data.type === 'Organization') {
    return (
      <AnalyzeOwnerContextProvider data={data}>
        <OrgAnalyzePageHeader />
        <Content />
      </AnalyzeOwnerContextProvider>
    );
  } else {
    redirect(`https://ossinsight.io/analyze/${params.owner}`);
  }
}
