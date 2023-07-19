import widgets from '@ossinsight/widgets';
import Link from 'next/link';

export default function Home () {

  return (
    <main className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">This project is in development</h1>
      <h2 className="text-xl mb-2">Widgets list</h2>
      <p className='text-sm text-gray-400 mb-2'>All widgets will have default parameter <code>repo_id=41986369</code> (pingcap/tidb)</p>
      <ul>
        {Object.keys(widgets).map(name => (
          <li className="text-blue-700 cursor-pointer" key={name}>
            <Link href={`/widgets/official/${getName(name)}?repo_id=41986369`}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}
