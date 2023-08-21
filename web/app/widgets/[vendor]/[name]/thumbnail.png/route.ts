import config from '@/site.config';
import { resolveImageSizeConfig } from '@/utils/siteConfig';
import { createDefaultComposeLayout, isWidget, widgetDatasourceFetcher, widgetMetadataGenerator, widgetParameterDefinitions, widgetVisualizer } from '@/utils/widgets';
import { Canvas } from '@napi-rs/canvas';
import { resolveExpressions } from '@ossinsight/widgets-core/src/parameters/resolveExpressions';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import render from '@ossinsight/widgets-core/src/renderer/node';
import renderCompose from '@ossinsight/widgets-core/src/renderer/node/compose';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
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
  const datasource = widgetDatasourceFetcher(name);
  const params = await widgetParameterDefinitions(name);
  const visualizer = await widgetVisualizer(name);
  const generateMetadata = await widgetMetadataGenerator(name);

  const parameters: any = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    if (EXCLUDED_PARAMETERS.includes(key)) {
      return;
    }
    parameters[key] = value;
  });

  Object.assign(parameters, resolveExpressions(params));

  const paramDef = await widgetParameterDefinitions(name);
  const linkedData = await resolveParameters(paramDef, parameters);

  const data = await datasource({
    runtime: 'server',
    parameters,
  });

  const colorScheme = request.nextUrl.searchParams.get('color_scheme') ?? 'dark';

  const size = request.nextUrl.searchParams.get('image_size') ?? 'default';
  let width: number;
  let height: number;
  let dpr: number;
  const isDynamicHeight = !!(size === 'auto' && visualizer.computeDynamicHeight);
  if (isDynamicHeight) {
    width = 960;
    height = visualizer.computeDynamicHeight!(data);
    dpr = 2;
  } else {
    const resolved = resolveImageSizeConfig(config, size);
    width = resolved.width;
    height = resolved.height;
    dpr = resolved.dpr ?? 2;
  }

  const renderCtx = {
    ...createWidgetContext('server', parameters, linkedData),
    width: width,
    height: height,
    dpr,
  };

  let canvas: Canvas;

  if (visualizer.type !== 'compose') {
    // Use compose to render all others images temporary.
    canvas = await renderCompose(
      width,
      height,
      dpr,
      createDefaultComposeLayout(name, data, {
        generateMetadata,
        ctx: renderCtx,
        isDynamicHeight,
      }),
      data,
      parameters,
      linkedData,
      colorScheme,
      size,
    );
  } else {
    canvas = await render({
      type: visualizer.type,
      data,
      visualizer,
      width,
      height,
      dpr: dpr,
      parameters,
      linkedData,
      colorScheme,
      sizeName: size,
      root: true,
    });
  }

  return new NextResponse(canvas.toBuffer('image/png'), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-cache';
