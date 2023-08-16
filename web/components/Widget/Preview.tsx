import { widgetMeta, widgetParameterDefinitions } from '@/utils/widgets';
import { WidgetMeta } from '@ossinsight/widgets-types';
import ArrowUpRightIcon from 'bootstrap-icons/icons/arrow-up-right.svg'

import Image from 'next/image';

export async function WidgetPreview ({ name }: { name: string }) {
  const widget = widgetMeta(name);
  const imageUsp = new URLSearchParams(await dynamicParameters(name));

  imageUsp.set('image_size', 'preview_image');

  return (
    <div className="group rounded-md relative overflow-hidden bg-popover border w-full transition-shadow hover:shadow-lg">
      <div className="flex flex-col items-center bg-body p-4 gap-4" style={{ height: 270 }}>
        <h2 className="text-lg font-bold text-title">{formatName(getName(widget.name))}</h2>
        <Image className="block shadow-xl rounded-xl" loading="lazy" width={320} height={180} quality={100} src={`/widgets/official/${getName(name)}/thumbnail.png?${imageUsp.toString()}`} alt="preview" />
      </div>
      <div className='absolute bottom-0 left-0 w-full h-10 flex items-center justify-center gap-2 text-white transition-transform transform-gpu translate-y-full group-hover:translate-y-0' style={{ background: 'linear-gradient(98deg, #562FF2 0%, #6041DE 100%)' }}>
        edit it
        <ArrowUpRightIcon />
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
      usp.set(key, String(config.default));
    }
    return usp;
  }, new URLSearchParams());
  return usp.toString();
}


