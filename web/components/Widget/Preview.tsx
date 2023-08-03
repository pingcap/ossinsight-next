import { widgetMeta, widgetParameterDefinitions } from '@/utils/widgets';
import { WidgetMeta } from '@ossinsight/widgets-types';
import Image from 'next/image';

export async function WidgetPreview ({ name }: { name: string }) {
  const widget = widgetMeta(name);
  const imageUsp = new URLSearchParams(await dynamicParameters(name));
  imageUsp.set('image_size', 'preview_image')

  return (
    <div className="rounded-md relative overflow-hidden bg-popover border w-[320px] transition-shadow hover:shadow-lg">
      <Image className="block" loading="lazy" width={320} height={240} src={`/widgets/official/${getName(name)}/thumbnail.png?${imageUsp.toString()}`} alt="preview" />
      <div className='w-full h-[72px]'/>
      <div className="p-2 border-t bg-toolbar absolute bottom-0 left-0 w-full translate-y-[calc(100%-72px)] hover:translate-y-0 transition">
        <h2 className="text-lg font-bold text-title">{formatName(getName(widget.name))}</h2>
        {widget.keywords?.length && (
          <ul className="mt-2 flex gap-2 items-center flex-wrap">
            {widget.keywords.map(keyword => (
              <li key={keyword} className="px-1 py-0.5 rounded bg-control text-subtitle text-xs">{keyword}</li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex items-center gap-2 text-subtitle text-sm">
          {renderAuthor(widget)}
          <span className="text-sm text-disabled">v{widget.version}</span>
        </div>
        <p className="mt-1 text-sm text-content line-clamp-3 text-ellipsis">{widget.description}</p>
      </div>
    </div>
  );
}

function getName (name: string) {
  return name.replace(/^@ossinsight\/widget-/, '');
}

function formatName (name: string) {
  return name
    .replace(/-/g, ' ')
    .replace(/^[a-z]/, e => e.toUpperCase());
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


export async function dynamicParameters (name: string) {
  const params = await widgetParameterDefinitions(name);
  const usp = Object.entries(params).reduce((usp, [key, config]) => {
    if (config.default != null) {
      usp.set(key, String(config.default))
    }
    return usp;
  }, new URLSearchParams())
  return usp.toString()
}


