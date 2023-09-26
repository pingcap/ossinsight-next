import OrgNav from '@/components/Analyze/Navigation/OrgNav';
import OrgBottomNav from '@/components/Analyze/Navigation/OrgBottomNav';
import { OrgPageNavWrapper } from '@/components/Analyze/Navigation/OrgPageWrapper';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function UserOrgAnalyzeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { owner: string };
}) {
  const { owner } = params;

  return (
    <>
      <div className='flex'>
        <div className='flex w-full flex-col md:flex-row'>
          <aside className='bg-toolbar border-r md:min-h-[calc(100vh-var(--site-header-height))]'>
            <div className='sticky top-[var(--site-header-height)] h-full overflow-y-auto max-h-[calc(100vh-var(--site-header-height))] styled-scrollbar'>
              <OrgNav org={owner} />
            </div>
          </aside>
          {/* <OrgPageNavWrapper org={owner}> */}
          <main className='flex-1 block'>
            <div className={`p-8 max-w-[1200px] mx-auto`}>{children}</div>
            <OrgBottomNav org={owner} />
          </main>
          {/* </OrgPageNavWrapper> */}
        </div>
      </div>
      {/* <footer className='bg-toolbar border-t'>
        footer
      </footer> */}
    </>
  );
}