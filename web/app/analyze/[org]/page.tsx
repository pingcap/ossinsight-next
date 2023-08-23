import AnalyzeOrgContextProvider, {
  AnalyzeOrgContextProps,
} from '@/components/Context/Analyze/AnalyzeOrg';
import OrgAnalyzePageHeader from '@/components/Analyze/Header/OrgHeader';

const fetchOrgInfo = async (
  orgName: string
): Promise<AnalyzeOrgContextProps> => {
  // TODO - fetch org info
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    orgName: 'pingcap',
    orgId: 11855343,
  };
};

export default async function OrgAnalyzePage({
  params,
}: {
  params: { org: string };
}) {
  const data = await fetchOrgInfo(params.org);

  return (
    <AnalyzeOrgContextProvider data={data}>
      <OrgAnalyzePageHeader />
      OrgAnalyzePage
    </AnalyzeOrgContextProvider>
  );
}
