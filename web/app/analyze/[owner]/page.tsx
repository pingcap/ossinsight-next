import Content from '@/app/analyze/[owner]/content';
import { fetchOwnerInfo } from '@/app/analyze/[owner]/fetchOwner';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';
import AnalyzeOwnerContextProvider from '@/components/Context/Analyze/AnalyzeOwner';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

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

export async function generateMetadata ({ params }: { params: { owner: string } }): Promise<Metadata> {
  const data = await fetchOwnerInfo(decodeURIComponent(params.owner));
  if (data.type === 'Organization') {
    const title = `Analyze ${data.name} | OSSInsight`
    const description = 'Unlock the power of time-flexible organization analytics, community recognition metrics, participant insights, and productivity analysis with OSSInsight.';
    return {
      title,
      description,
      keywords: [
        'OSSInsight',
        'open-source company',
        'organization analytics',
        'GitHub organization',
        'star growth',
        'collaboration metrics',
        'participant insights',
        'productivity analysis',
      ],
      twitter: {
        title,
        description,
      },
      openGraph: {
        title,
        description,
      }
    };
  } else {
    return {};
  }
}


