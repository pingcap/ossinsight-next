import { dynamicParameters, Filter, WidgetPreview } from '@/components/Widget';
import { filteredWidgetsNames } from '@/utils/widgets';
import { Metadata } from 'next';
import Link from 'next/link';
import Heading from './Heading.mdx';

export default async function Home ({ searchParams }: { searchParams: any }) {
  const config = {
    search: searchParams['q'] ?? '',
    tag: (typeof searchParams['tag'] === 'string' ? searchParams['tag'] : undefined),
  };

  return (
    <main className="container mx-auto py-16 px-2">
      <article className="mb-4 prose prose-invert max-w-none">
        <Heading />
      </article>
      <Filter config={config} />
      <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {await Promise.all(filteredWidgetsNames(config).map(async name => (
          <li key={name} className='col-span-1'>
            <Link className="block" href={`/widgets/official/${getName(name)}?${await dynamicParameters(name)}`}>
              <WidgetPreview name={name} />
            </Link>
          </li>
        )))}
      </ul>
    </main>
  );
}

export const metadata = {
  title: 'Customize GitHub Widgets: Data Insight, Social Sharing | OSS Insight',
  description: 'Description: Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
  keywords: [
    'GitHub widgets',
    'Custom widgets',
    'Widget creator',
    'Personalized widgets',
    'GitHub profile enhancement',
    'Share widgets',
    'Online presence',
    'Customization tools',
  ],
  openGraph: {
    title: 'Customize GitHub Widgets: Data Insight, Social Sharing | OSS Insight',
    description: 'Description: Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
    images: [
      {
        url: '/seo-widgets-homepage.jpeg',
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customize GitHub Widgets: Data Insight, Social Sharing | OSS Insight',
    description: 'Description: Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
    images: ['/seo-widgets-homepage.jpeg'],
  },
} satisfies Metadata;

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}
