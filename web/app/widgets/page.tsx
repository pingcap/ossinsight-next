import { Filter, WidgetsList } from '@/components/Widget';
import { filteredWidgetsNames, nonPopularWidgetsNames } from '@/utils/widgets';
import { Metadata } from 'next';
import Heading from './Heading.mdx';

export default async function Home ({ searchParams }: {
  searchParams: any
}) {
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
      <section className='grid grid-cols-1 divide-dashed divide-y-4'>
        <WidgetsList className='py-8' widgets={filteredWidgetsNames(config)} />
        {!config.tag && (
          <WidgetsList className='py-8' widgets={nonPopularWidgetsNames()} />
        )}
      </section>
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
  twitter: {
    card: 'summary_large_image',
  },
} satisfies Metadata;

