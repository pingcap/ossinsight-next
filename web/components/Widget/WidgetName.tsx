'use client'

import { widgetMetadataGenerator, widgetParameterDefinitions } from '@/utils/widgets';
import { TextSkeleton } from '@ossinsight/ui/src/components/Skeleton';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { useEffect, useState, useTransition } from 'react';

export function WidgetName ({ widget }: { widget: string }) {
  const [name, setName] = useState('');
  const [transition, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
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

      setName(metadata.title ?? 'Untitled');
    });
  }, [widget]);

  if (transition || !name) {
    return <TextSkeleton characters={12} />
  } else {
    return <>{name}</>;
  }
}
