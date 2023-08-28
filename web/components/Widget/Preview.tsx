import { widgetMetadataGenerator, widgetParameterDefinitions } from '@/utils/widgets';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { WidgetMeta } from '@ossinsight/widgets-types';
import ArrowUpRightIcon from 'bootstrap-icons/icons/arrow-up-right.svg';

import Image from 'next/image';
import { Suspense } from 'react';

export async function WidgetPreview ({ name }: { name: string }) {
  const imageUsp = new URLSearchParams(await dynamicParameters(name));

  imageUsp.set('image_size', 'preview_image');

  return (
    <div className="group rounded-md relative overflow-hidden bg-popover border w-full transition-shadow hover:shadow-lg">
      <div className="flex flex-col items-center bg-body p-4 gap-4" style={{ height: 360 }}>
        <h2 className="text-lg font-bold text-title">
          <Suspense fallback="&nbsp;">
            <WidgetName widget={name} />
          </Suspense>
        </h2>
        <Image
          className="block"
          loading="lazy"
          width={480}
          height={270}
          quality={100}
          src={`/widgets/official/${getName(name)}/thumbnail.png?${imageUsp.toString()}`}
          alt="preview"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-10 flex items-center justify-center gap-2 text-white transition-transform transform-gpu translate-y-full group-hover:translate-y-0" style={{ background: 'linear-gradient(98deg, #562FF2 0%, #6041DE 100%)' }}>
        edit it
        <ArrowUpRightIcon />
      </div>
    </div>
  );
}

async function WidgetName ({ widget }: { widget: string }) {
  const [metadataGenerator, params] = await Promise.all([
    widgetMetadataGenerator(widget),
    widgetParameterDefinitions(widget),
  ]);

  const parameters: any = {};
  Object.entries(params).forEach(([key, config]) => {
    if (config.default != null) {
      parameters[key] = config.default;
    }
  });

  const metadata = metadataGenerator({
    ...createWidgetContext('client', parameters, null as any),
    getCollection () { return { id: 0, name: 'Collection', public: true }; },
    getRepo () { return { id: 0, fullName: 'Repository' }; },
    getUser () { return { id: 0, login: 'Developer' };},
    getOrg () { return { id: 0, name: 'Organization' }; },
    getTimeParams () { return { zone: 'TimeZone', period: 'Period' }; },
  });

  return <>{metadata.title}</>;
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


