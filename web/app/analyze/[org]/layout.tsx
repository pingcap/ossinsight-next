import OrgNav from '@/components/Analyze/Navigation/OrgNav';

export default function UserOrgAnalyzeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org: string };
}) {
  const { org } = params;

  return (
    <>
      <div className='flex'>
        <div className='flex w-full flex-col md:flex-row'>
          <aside className='bg-toolbar border-r md:min-h-[calc(100vh-var(--site-header-height))]'>
            <div className='sticky top-[var(--site-header-height)] h-full overflow-y-auto max-h-[calc(100vh-var(--site-header-height))] styled-scrollbar'>
              <OrgNav org={org} />
            </div>
          </aside>
          <main className='flex-1 overflow-x-hidden'>
            <div className='pl-6 pr-24 py-8'>{children}</div>
          </main>
        </div>
      </div>
      {/* <footer className='bg-toolbar border-t'>
        footer
      </footer> */}
    </>
  );
}
