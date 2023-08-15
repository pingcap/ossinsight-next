import Filter from '@/app/widgets/Filter';
import { dynamicParameters, WidgetPreview } from '@/components/Widget';
import { filteredWidgetsNames } from '@/utils/widgets';
import Heading from './Heading.mdx';
import Link from 'next/link';

export default async function Home ({ searchParams }: { searchParams: any }) {
  const config = {
    search: searchParams['q'] ?? '',
    tag: (typeof searchParams['tag'] === 'string' ? searchParams['tag'] : undefined),
  };

  return (
    <main className="container mx-auto py-4 px-2">
      <article className='prose prose-invert max-w-none'>
        <Heading />
      </article>
      <Filter config={config} />
      <ul className="mt-8 flex justify-center gap-4 flex-wrap">
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
