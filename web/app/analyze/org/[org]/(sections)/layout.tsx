import NextLink from 'next/link';

import OrgBottomNav from '@/components/Analyze/Navigation/OrgBottomNav';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { org: string };
}) {
  return (
    <>
      {children}
      <OrgBottomNav org={params.org} />
    </>
  );
}
