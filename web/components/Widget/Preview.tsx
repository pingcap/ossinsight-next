import widgets from '@ossinsight/widgets';
import { WidgetMeta } from '@ossinsight/widgets-types';
import Image from 'next/image';

export function WidgetPreview ({ name }: { name: string }) {
  const widget = widgets[name];

  return (
    <div className="rounded-md overflow-hidden bg-white border w-[320px] transition-shadow hover:shadow-lg">
      <Image className="block object-cover" width={320} height={240} src={`/widgets/official/${getName(name)}/thumbnail.png?repo_id=41986369&width=640&height=480`} alt="preview" />
      <div className="p-4 border-t bg-gray-50">
        <h2 className="text-lg font-bold text-gray-700">{widget.name}</h2>
        {widget.keywords?.length && (
          <ul className='mt-2 flex gap-2 items-center flex-wrap'>
            {widget.keywords.map(keyword => (
              <li key={keyword} className='px-1 py-0.5 rounded bg-gray-200 text-gray-700 text-xs'>{keyword}</li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex items-center gap-2 text-gray-400 text-sm">
          {renderAuthor(widget)}
          <span className="text-sm text-gray-400">v{widget.version}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{widget.description}</p>
      </div>
    </div>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}

function renderAuthor (meta: WidgetMeta) {
  if (!meta.author) {
    return <b>@unknown</b>;
  }
  if (typeof meta.author === 'string') {
    return <b>@{meta.author}</b>;
  } else {
    return <b>@{meta.author.name ?? 'unknown'}</b>;
  }
}

