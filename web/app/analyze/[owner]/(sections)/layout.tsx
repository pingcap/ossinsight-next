import NextLink from 'next/link';

import OrgBottomNav from '@/components/Analyze/Navigation/OrgBottomNav';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { owner: string };
}) {
  return (
    <>
      {children}
      <OrgBottomNav org={params.owner} />
    </>
  );
}
