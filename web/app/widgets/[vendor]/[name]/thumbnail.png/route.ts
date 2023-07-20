import widgets, { datasourceFetchers, visualizers } from '@ossinsight/widgets';
import render from '@ossinsight/widgets-core/src/renderer/node';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET (request: NextRequest, { params: { vendor, name: paramName } }: { params: { vendor: string, name: string } }) {
  if (vendor !== 'official') {
    notFound();
  }

  const name = `@ossinsight/widget-${decodeURIComponent(paramName)}`;

  const meta = widgets[name];
  if (!meta) {
    notFound();
  }
  const datasource = await datasourceFetchers[name];
  const visualizer = await visualizers[name]();

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

  const buffer = await render({
    type: visualizer.type,
    data,
    visualizer: visualizer.default,
    width: parseSize(width, 400, 1920) ?? 400,
    height: parseSize(height, 400, 1920) ?? 400,
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
