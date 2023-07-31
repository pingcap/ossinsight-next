import { widgetMeta, widgetParameterDefinitions } from '@/utils/widgets';
import { WidgetMeta } from '@ossinsight/widgets-types';
import Image from 'next/image';

export async function WidgetPreview ({ name }: { name: string }) {
  const widget = widgetMeta(name);
  const imageUsp = new URLSearchParams(await dynamicParameters(name));
  imageUsp.set('image_size', 'preview_image')

  return (
    <div className="rounded-md overflow-hidden bg-popover border w-[320px] transition-shadow hover:shadow-lg">
      <Image className="block" loading="lazy" width={320} height={240} src={`/widgets/official/${getName(name)}/thumbnail.png?${imageUsp.toString()}`} alt="preview" />
      <div className="p-4 border-t bg-toolbar">
        <h2 className="text-lg font-bold text-title">{getName(widget.name)}</h2>
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
        <p className="mt-1 text-sm text-content">{widget.description}</p>
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


