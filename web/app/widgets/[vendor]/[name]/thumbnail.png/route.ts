import { isWidget, widgetDatasourceFetcher, widgetVisualizer } from '@/utils/widgets';
import render from '@ossinsight/widgets-core/src/renderer/node';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (request: NextRequest, { params: { vendor, name: paramName } }: { params: { vendor: string, name: string } }) {
  if (vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(paramName)}`;

  if (!isWidget(name)) {
    notFound();
  }
  const datasource = await widgetDatasourceFetcher(name);
  const visualizer = await widgetVisualizer(name);

  const parameters: any = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (['widget', 'height'].includes(key)) {
      return;
    }
    parameters[key] = value;
  });

  const data = await datasource({
    runtime: 'server',
    parameters,
  });

  const width = request.nextUrl.searchParams.get('width');
  const height = request.nextUrl.searchParams.get('height');
  const devicePixelRatio = request.nextUrl.searchParams.get('dpr');

  const buffer = await render({
    type: visualizer.type,
    data,
    visualizer: visualizer.default,
    width: parseSize(width, 120, 1920) ?? 400,
    height: parseSize(height, 120, 1920) ?? 400,
    dpr: parseSize(devicePixelRatio, 1, 3) ?? 2,
    parameters,
  });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

function parseSize (raw: string | undefined | null, min: number, max: number) {
  const val = Number(raw);
  if (isFinite(val)) {
    return Math.max(Math.min(val, max), min);
  }

  return undefined;
}

export const dynamic = 'force-dynamic';
