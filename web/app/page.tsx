import Filter from '@/app/filter';
import { dynamicParameters, WidgetPreview } from '@/components/Widget';
import { filteredWidgetsNames, widgetParameterDefinitions } from '@/utils/widgets';
import Link from 'next/link';

export default async function Home ({ searchParams }: { searchParams: any }) {
  const config = {
    search: searchParams['q'] ?? '',
    tags: (typeof searchParams['tag'] === 'string' ? [searchParams['tag']] : searchParams['tag']) ?? [],
  };

  return (
    <main className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4 text-title">This project is in development</h1>
      <h2 className="text-xl mb-2 text-subtitle">Widgets list</h2>
      <Filter config={config} />
      <p className="text-sm mt-2">All widgets will have default parameter <code>repo_id=41986369</code> (pingcap/tidb)</p>
      <ul className="mt-2 flex justify-between gap-2 flex-wrap">
        {await Promise.all(filteredWidgetsNames(config).map(async name => (
          <li key={name}>
            <Link className="block w-min" href={`/widgets/official/${getName(name)}?${await dynamicParameters(name)}`}>
              <WidgetPreview name={name} />
            </Link>
          </li>
        )))}
      </ul>
    </main>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}
