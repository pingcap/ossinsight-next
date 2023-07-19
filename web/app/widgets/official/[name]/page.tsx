import Widget, { WidgetParameters } from '@/components/Widget';
import { datasourceFetchers } from '@ossinsight/widgets';
import { notFound } from 'next/navigation';

export default async function Page ({ params, searchParams }: { params: { name: string }, searchParams: Record<string, string> }) {
  const name = `@ossinsight/widget-${decodeURIComponent(params.name)}`;
  if (!(name in datasourceFetchers)) {
    notFound();
  }
  const fetcher = datasourceFetchers[name];

  const data = await fetcher({
    runtime: 'server',
    parameters: searchParams,
  });

  return (
    <main className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-700">Widget landing page prototype</h1>
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <WidgetParameters widgetName={name} />
      </div>
      <Widget name={name} params={searchParams} data={data} />
      <div className="p-4 border-dashed border-2 rounded-2xl">
        <p className="text-gray-400">
          Share operations will be placed here
        </p>
      </div>
    </main>
  );
}

export function resolveInitialCache () {

}
