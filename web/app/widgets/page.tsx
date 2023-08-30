import { Filter, WidgetCreator, WidgetsList } from '@/components/Widget';
import { filteredWidgetsNames, nonPopularWidgetsNames } from '@/utils/widgets';
import { ScrollAnchor } from '@ossinsight/ui/src/components/ScrollAnchor';
import { SwitchingText } from '@ossinsight/ui/src/components/SwitchingText';
import ArrowDownIcon from 'bootstrap-icons/icons/arrow-down.svg'
import { Metadata } from 'next';

export default async function Home ({ searchParams }: {
  searchParams: any
}) {
  const config = {
    search: searchParams['q'] ?? '',
    tag: (typeof searchParams['tag'] === 'string' ? searchParams['tag'] : undefined),
  };

  return (
    <main className="container mx-auto py-16 px-2">
      <h1 className="lg:text-center text-4xl text-title">
        {'Embed Real-time Widget in '}
        <SwitchingText>
          <span className="text-[#FFDF34]">
            &#8203;Repo&apos;s
          </span>
          <span className="text-[#FF9356]">
            &#8203;Personal
          </span>
        </SwitchingText>
        {' README.md within 30s!'}
      </h1>
      <WidgetCreator className="mt-16" />
      <ScrollAnchor className="text-center text-title flex items-center gap-2 justify-center mx-auto mt-8" id='widgets-list' top={120}>
        <ArrowDownIcon />
        Find more customized widgets
      </ScrollAnchor>
      <Filter config={config} />
      <section id='widgets-list' className="grid grid-cols-1 divide-dashed divide-y-4">
        <WidgetsList className="py-8" widgets={filteredWidgetsNames(config)} />
        {!config.tag && (
          <WidgetsList className="py-8" widgets={nonPopularWidgetsNames()} />
        )}
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Customize GitHub Widgets: Data Insight, Social Sharing | OSS Insight',
  description: 'Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
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
    description: 'Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
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
    description: 'Unlock the power of customization with our GitHub widget creator. Design unique and eye-catching widgets to enhance your GitHub profile, blog, and more. Share your personalized creations effortlessly!',
    images: ['/seo-widgets-homepage.jpeg'],
  },
} satisfies Metadata;

