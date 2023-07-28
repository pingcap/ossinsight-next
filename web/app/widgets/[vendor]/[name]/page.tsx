import { Share } from '@/components/Share';
import { ServerWidget, ServerParameters } from '@/components/Widget/server';
import { isWidget, widgetMeta, widgetMetadataGenerator, widgetParameterDefinitions } from '@/utils/widgets';
import { ChartSkeleton } from '@ossinsight/ui/src/components/Skeleton';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import * as colors from 'tailwindcss/colors';

type Props = { params: { vendor: string, name: string }, searchParams: Record<string, string> };

export default function Page ({ params, searchParams }: Props) {
  if (params.vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(params.name)}`;
  if (!isWidget(name)) {
    notFound();
  }

  const linkedData = widgetParameterDefinitions(name).then(paramDef => resolveParameters(paramDef, searchParams));

  const signature = JSON.stringify({ ...params, searchParams });

  return (
    <main className="container mx-auto py-4 max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-4 text-title">Widget landing page prototype</h1>
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <Suspense key={signature} fallback="loading...">
          <ServerParameters name={name} linkedDataPromise={linkedData} />
        </Suspense>
      </div>
      <Suspense key={signature} fallback={<ChartSkeleton className="WidgetContainer" />}>
        <ServerWidget className="WidgetContainer" name={name} searchParams={searchParams} linkedDataPromise={linkedData} />
      </Suspense>
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <Suspense key={signature} fallback="loading...">
          <Share name={name} params={params} searchParams={searchParams} linkedDataPromise={linkedData} />
        </Suspense>
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
