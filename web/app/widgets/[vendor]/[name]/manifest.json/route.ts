import { isWidget, widgetMeta, widgetMetadataGenerator, widgetParameterDefinitions } from '@/utils/widgets';
import { resolveExpressions } from '@ossinsight/widgets-core/src/parameters/resolveExpressions';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createLinkedDataContext, createWidgetBaseContext } from '@ossinsight/widgets-core/src/utils/context';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const EXCLUDED_PARAMETERS = [
  'image_size',
  'color_scheme',
  // Comparing feature is disabled temporary.
  'vs_repo_id',
];

export async function GET (request: NextRequest, { params: { vendor, name: paramName } }: { params: { vendor: string, name: string } }) {
  if (vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(paramName)}`;

  if (!isWidget(name)) {
    notFound();
  }

  const { description, keywords } = widgetMeta(name)
  console.log(description, keywords)

  const generateMetadata = await widgetMetadataGenerator(name);

  const parameters: any = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (EXCLUDED_PARAMETERS.includes(key)) {
      return;
    }
    parameters[key] = value;
  });


  const paramDef = await widgetParameterDefinitions(name);
  Object.assign(parameters, resolveExpressions(paramDef));
  const linkedData = await resolveParameters(paramDef, parameters);

  const metadata = generateMetadata({
    ...createWidgetBaseContext('server', parameters),
    ...createLinkedDataContext(linkedData),
  });

  return NextResponse.json({
    imageUrl: request.url.replace('manifest.json', 'thumbnail.png'),
    pageUrl: request.url.replace('/manifest.json', ''),

    title: metadata.title,
    description: metadata.description ?? description,
    keywords: metadata.keywords ?? keywords,
  });
}

export const dynamic = 'force-dynamic';
