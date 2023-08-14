import Filter from '@/app/filter';
import { dynamicParameters, WidgetPreview } from '@/components/Widget';
import { filteredWidgetsNames, widgetParameterDefinitions } from '@/utils/widgets';
import Link from 'next/link';

export default async function Home ({ searchParams }: { searchParams: any }) {
  const config = {
    search: searchParams['q'] ?? '',
    tags: (typeof searchParams['tag'] === 'string' ? [searchParams['tag']] : searchParams['tag']) ?? [],
  };

  return (
    <main className="container mx-auto py-4 px-2">
      <h1 className="text-3xl font-bold mb-4 text-title">This project is in development</h1>
      <h2 className="text-xl mb-2 text-subtitle">Widgets list</h2>
      <Filter config={config} />
      <ul className="mt-8 flex justify-center gap-4 flex-wrap">
        {await Promise.all(filteredWidgetsNames(config).map(async name => (
          <li key={name}>
            <Link className="block w-min" href={`/widgets/official/${getName(name)}?${await dynamicParameters(name)}`}>
              <WidgetPreview name={name} />
            </Link>
          </li>
        )))}
      </ul>
    </main>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}

// TODO - add SEO, extract to separate file
export const metadata = {
  openGraph: {
    title: 'Widgets List',
    description: 'This project is in development',
    url: 'https://next.ossinsight.io/',
    siteName: 'OSS Insight',
    images: [
      {
        url: '/seo-widgets-homepage.jpeg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Widgets List',
    description: 'This project is in development',
    creator: '@ossinsight',
    images: ['/seo-widgets-homepage.jpeg'],
  },
};
