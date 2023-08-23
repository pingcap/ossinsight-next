import OrgNav from '@/components/Analyze/Navigation/OrgNav';

export default function UserOrgAnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='flex'>
        <div className='flex w-full flex-col md:flex-row'>
          <aside className='bg-toolbar border-r min-h-[calc(100vh-var(--site-header-height))]'>
            {/* <div className='p-4 sticky h-full overflow-y-auto max-h-[calc(100vh-var(--site-header-height))] styled-scrollbar'> */}
            <OrgNav />
          </aside>
          <main className='flex-1 overflow-x-hidden'>
            <div className='p-2'>
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* <footer className='bg-toolbar border-t'>
        footer
      </footer> */}
    </>
  );
}
