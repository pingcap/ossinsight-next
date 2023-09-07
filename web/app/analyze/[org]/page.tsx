import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { org: string } }) {
  redirect(`/analyze/${params.org}/overview`);

  // ...
}
