import { ServerWidget } from '@/components/Widget/server';
import { widgetMeta, widgetMetadataGenerator } from '@/utils/widgets';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { makeLinkedData, widgetPageParams, WidgetPageProps } from './utils';

export default function page (props: WidgetPageProps) {
  const { name } = widgetPageParams(props.params);
  const linkedData = makeLinkedData(name, props.searchParams);

  return (
    <ServerWidget className="WidgetContainer" name={name} searchParams={props.searchParams} linkedDataPromise={linkedData} />
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
    ...createWidgetContext('server', searchParams, linkedData),
  });

  twitterImageUsp.set('image_size', 'twitter:summary_large_image');

  return {
    title: title ?? decodeURIComponent(params.name),
    description: description || widget.description,
    keywords: ['OSSInsight', 'OSSInsight Widget', 'GitHub Analytics'].concat(widget.keywords ?? []).concat(keywords ?? []),
    openGraph: {
      title: title ?? decodeURIComponent(params.name),
      description: description ?? widget.description,
      tags: (widget.keywords ?? []).concat(keywords ?? []),
      images: [`${protocol}://${host}/widgets/${params.vendor}/${params.name}/thumbnail.png?${usp.toString()}`],
    },
    twitter: {
      title: title ?? decodeURIComponent(params.name),
      description: description ?? widget.description,
      card: 'summary_large_image',
      images: [`${protocol}://${host}/widgets/${params.vendor}/${params.name}/thumbnail.png?${twitterImageUsp.toString()}`],
    },
  };
}

const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
