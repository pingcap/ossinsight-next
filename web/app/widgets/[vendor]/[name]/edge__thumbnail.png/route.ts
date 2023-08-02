// import config from '@/site.config';
// import { resolveImageSizeConfig } from '@/utils/siteConfig';
// import { isWidget, widgetDatasourceFetcher, widgetParameterDefinitions, widgetVisualizer } from '@/utils/widgets';
// import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
// import render from '@ossinsight/widgets-core/src/renderer/node/edge';
// import { NextURL } from 'next/dist/server/web/next-url';
// import { notFound } from 'next/navigation';
// import { NextRequest, NextResponse } from 'next/server';
//
// const EXCLUDED_PARAMETERS = ['image_size'];
//
// export async function GET (request: NextRequest, { params: { vendor, name: paramName } }: { params: { vendor: string, name: string } }) {
//   if (vendor !== 'official') {
//     notFound();
//   }
//
//   const name = `@ossinsight/widget-${decodeURIComponent(paramName)}`;
//
//   if (!isWidget(name)) {
//     notFound();
//   }
//   const datasource = await widgetDatasourceFetcher(name);
//   const visualizer = await widgetVisualizer(name);
//
//   if (['echarts'].includes(visualizer.type)) {
//     const newUrl = new NextURL(request.nextUrl);
//     newUrl.pathname = newUrl.pathname.replace('edge__thumbnail.png', 'thumbnail.png');
//     return NextResponse.redirect(newUrl);
//   }
//
//   const parameters: any = {};
//   request.nextUrl.searchParams.forEach((value, key) => {
//     if (EXCLUDED_PARAMETERS.includes(key)) {
//       return;
//     }
//     parameters[key] = value;
//   });
//
//   const paramDef = await widgetParameterDefinitions(name);
//   const linkedData = await resolveParameters(paramDef, parameters);
//
//   const data = await datasource({
//     runtime: 'server',
//     parameters,
//   });
//
//   const size = request.nextUrl.searchParams.get('image_size') ?? 'default';
//   let width: number;
//   let height: number;
//   let dpr: number | undefined;
//   if (size === 'auto' && visualizer.computeDynamicHeight) {
//     width = 960;
//     height = visualizer.computeDynamicHeight(data);
//     dpr = 2;
//   } else {
//     const resolved = resolveImageSizeConfig(config, size);
//     width = resolved.width;
//     height = resolved.height;
//     dpr = resolved.dpr;
//   }
//
//   const buffer = await render({
//     type: visualizer.type,
//     data,
//     visualizer,
//     width,
//     height,
//     dpr: dpr ?? 2,
//     parameters,
//     linkedData,
//   });
//
//   return new NextResponse(buffer as any, {
//     headers: {
//       'Content-Type': 'image/png',
//     },
//   });
// }
//
// export const runtime = 'edge';
//
// export const dynamic = 'force-dynamic';
export default async function a() {}