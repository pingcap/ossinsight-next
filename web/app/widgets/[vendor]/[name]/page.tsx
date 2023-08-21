import { ServerWidget } from '@/components/Widget/server';
import { widgetMeta, widgetMetadataGenerator } from '@/utils/widgets';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import { makeLinkedData, widgetPageParams, WidgetPageProps } from './utils';

export default function page (props: WidgetPageProps) {
  const { name } = widgetPageParams(props.params);
  const linkedData = makeLinkedData(name, props.searchParams);

  return (
    <Suspense>
      <ServerWidget className="WidgetContainer" name={name} searchParams={props.searchParams} linkedDataPromise={linkedData} />
    </Suspense>
  );
}

export async function generateMetadata ({ params, searchParams }: WidgetPageProps): Promise<Metadata> {
  const requestHeaders = headers();
  const host = requestHeaders.get('host');

  const { name } = widgetPageParams(params);

  const widget = widgetMeta(name);
  const generateMetadata = await widgetMetadataGenerator(name);

  if (!widget) {
    return {};
  }

  const linkedData = await makeLinkedData(name, searchParams);

  const usp = new URLSearchParams(searchParams);
  const twitterImageUsp = new URLSearchParams(usp);

  const { title, description, keywords } = generateMetadata({
    width: 0,
    height: 0,
    dpr: 1,
    ...createWidgetContext('server', searchParams, linkedData),
  });

  twitterImageUsp.set('image_size', 'twitter:summary_large_image');

  const finalTitle = (title ?? decodeURIComponent(params.name)) + ' | OSSInsight';
  const finalDescription = description || widget.description;
  const finalKeywords =  ['OSSInsight', 'OSSInsight Widget', 'GitHub Analytics'].concat(widget.keywords ?? []).concat(keywords ?? []);

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      tags: (widget.keywords ?? []).concat(keywords ?? []),
      images: [`${protocol}://${host}/widgets/${params.vendor}/${params.name}/thumbnail.png?${usp.toString()}`],
    },
    twitter: {
      title: finalTitle,
      description: finalDescription,
      card: 'summary_large_image',
      images: [`${protocol}://${host}/widgets/${params.vendor}/${params.name}/thumbnail.png?${twitterImageUsp.toString()}`],
    },
  };
}

const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
