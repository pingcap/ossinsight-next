import { dynamicParameters, WidgetPreview } from '@/components/Widget/Preview';
import Link from 'next/link';
import { CSSProperties } from 'react';

export async function WidgetsList ({ className, style, widgets }: {
  widgets: string[],
  className?: string,
  style?: CSSProperties
}) {
  return (
    <ul className={(className ? className + ' ' : '') + 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'} style={style}>
      {await Promise.all(widgets.map(async name => (
        <li key={name} className="col-span-1">
          <Link className="block" href={`/widgets/official/${getName(name)}?${await dynamicParameters(name)}`}>
            <WidgetPreview name={name} />
          </Link>
        </li>
      )))}
    </ul>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}
