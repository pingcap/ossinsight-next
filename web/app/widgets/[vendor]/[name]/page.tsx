import Widget, { WidgetParameters } from '@/components/Widget';
import { isWidget, widgetDatasourceFetcher, widgetMeta, widgetMetadataGenerator, widgetParameterDefinitions } from '@/utils/widgets';
import { ShareBlock } from '@ossinsight/ui/src/components/ShareBlock';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { use } from 'react';
import * as colors from 'tailwindcss/colors';

type Props = { params: { vendor: string, name: string }, searchParams: Record<string, string> };

const DOMAIN = 'https://ossinsight-next.vercel.app';

export default async function Page ({ params, searchParams }: Props) {
  if (params.vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(params.name)}`;
  if (!isWidget(name)) {
    notFound();
  }
  const fetcher = widgetDatasourceFetcher(name);

  const paramDef = await widgetParameterDefinitions(name);
  const linkedData = await resolveParameters(paramDef, searchParams);

  const data = await fetcher({
    runtime: 'server',
    parameters: searchParams,
  });

  const generateMetadata = await widgetMetadataGenerator(name);

  const { title } = generateMetadata({
    theme: { colors },
    parameters: searchParams,
    runtime: 'server',
    width: 0,
    height: 0,
    getRepo (id: number): any {
      return linkedData.repos[String(id)];
    },
    getUser (id: number): any {
      return {};
    },
    getCollection (id: number): any {
      return {};
    },
    getOrg (id: number): any {
      return {};
    },
  });

  const usp = new URLSearchParams(searchParams);
  const imageUsp = new URLSearchParams(usp);
  imageUsp.set('width', '640')
  imageUsp.set('height', '480')
  imageUsp.set('dpr', '2')

  return (
    <main className="container mx-auto py-4 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Widget landing page prototype</h1>
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <WidgetParameters widgetName={name} linkedData={linkedData} />
      </div>
      <Widget name={name} params={searchParams} data={data} linkedData={linkedData} />
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <ShareBlock
          title={title ?? 'Untitled'}
          url={`${DOMAIN}/widgets/${params.vendor}/${params.name}?${usp.toString()}`}
          thumbnailUrl={`${DOMAIN}/widgets/${params.vendor}/${params.name}/thumbnail.png?${imageUsp.toString()}`}
        />
      </div>
    </main>
  );
}

export async function generateMetadata ({ params, searchParams }: Props): Promise<Metadata> {
  const requestHeaders = headers();
  const host = requestHeaders.get('host');

  const name = `@ossinsight/widget-${decodeURIComponent(params.name)}`;

  const widget = widgetMeta(name);
  const generateMetadata = await widgetMetadataGenerator(name);

  if (!widget) {
    return {};
  }

  const paramDef = await widgetParameterDefinitions(name);
  const linkedData = await resolveParameters(paramDef, searchParams);

  const usp = new URLSearchParams(searchParams);
  const twitterImageUsp = new URLSearchParams(usp);

  const { title, description, keywords } = generateMetadata({
    theme: { colors },
    parameters: searchParams,
    runtime: 'server',
    width: 0,
    height: 0,
    getRepo (id: number): any {
      return linkedData.repos[String(id)];
    },
    getUser (id: number): any {
      return {};
    },
    getCollection (id: number): any {
      return {};
    },
    getOrg (id: number): any {
      return {};
    },
  });

  twitterImageUsp.set('width', '800');
  twitterImageUsp.set('height', '418');
  twitterImageUsp.set('dpr', '2');

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
