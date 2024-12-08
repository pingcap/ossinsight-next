import { filterWidgetUrlParameters } from '@/app/widgets/[vendor]/[name]/utils';
import widgets from '@ossinsight/widgets';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';
import { NextRequest, NextResponse } from 'next/server';
import { compile, TemplateParameter, TemplateScope } from './utils';

export async function GET (req: NextRequest) {
  const names = req.nextUrl.searchParams.getAll('names').map(decodeURIComponent);

  const scopes = await Promise.allSettled(
    Object.entries(widgets)
      .filter(([name]) => {
        if (names.length > 0) {
          return names.includes(name);
        } else {
          return true;
        }
      })
      .filter(([_, widget]) => {
        return !widget.meta.private;
      })
      .map(async ([widgetName, widget]) => {
        const { description, keywords, private: isPrive } = widget.meta;

        const generateMetadata = await widget.metadataGenerator();
        const parameterDefinitions = await widget.parameterDefinition();

        const metadata = await generateMetadata({
          ...createWidgetContext('client', {}, null as any),
          getCollection () { return { id: 0, name: 'Collection', public: true }; },
          getRepo () { return { id: 0, fullName: 'Repository' }; },
          getUser () { return { id: 0, login: 'Developer' };},
          getOrg () { return { id: 0, login: 'Organization' }; },
          getTimeParams () { return { zone: 'TimeZone', period: 'Period' }; },
        });

        const parsedWidgetName = widgetName.replaceAll('@ossinsight/widget-', '');
        const finalTitle = metadata.title ?? parsedWidgetName;
        const finalDescription = metadata.description ?? description ?? parsedWidgetName;

        // TODO: generate more detailed schema for special parameters
        const parameters = Object.entries(parameterDefinitions)
          .filter(([param]) => filterWidgetUrlParameters(widgetName, param))
          .filter(([, def]) => !('expression' in def))
          .map(([name, def]) => {
            let schema: any;
            let extra: any;

            switch (def.type) {
              case 'repo-id':
              case 'repo-ids':
              case 'user-id':
              case 'collection-id':
              case 'owner-id':
              case 'limit':
              case 'time-zone':
                schema = { type: 'number' };
                break;
              case 'month':
              case 'day':
                schema = { type: 'string' };
                break;
              default:
                schema = { type: 'string' };
                break;
            }

            if (def.array) {
              schema = { type: 'array', items: { oneOf: [schema] } };
            }

            if ('enums' in def) {
              schema.enum = def.enums;
            }

            switch (def.type) {
              case 'repo-id':
                extra = {
                  examples: {
                    'pingcap/tidb': { $ref: '#/components/examples/tidb' },
                    'tikv/tikv': { $ref: '#/components/examples/tikv' },
                  },
                };
                break;
              case 'user-id':
                extra = {
                  examples: {
                    'torvalds': { $ref: '#/components/examples/torvalds' },
                  },
                };
                break;
              case 'owner-id':
                extra = {
                  examples: {
                    'pingcap': { $ref: '#/components/examples/pingcap' },
                  },
                };
                break;
            }

            return {
              name,
              schema,
              extra,
              in: 'query',
              description: [def.description, def.title].filter(Boolean).join(' - '),
              required: def.required ? 'true' : 'false',
            } satisfies TemplateParameter;
          });

        return {
          normalized_name: parsedWidgetName,
          group: `widgets/${finalTitle}`,
          title: finalTitle,
          description: finalDescription,
          manifest: {
            id: 'getManifest',
            summary: 'Manifest for ' + finalTitle,
            description: finalDescription,
          },
          parameters,
        } satisfies TemplateScope;
      }));

  const yml = await compile({ widgets: scopes.flatMap(s => s.status === 'fulfilled' ? [s.value] : []) });

  return new NextResponse(yml, {
    headers: {
      'Content-Type': 'application/openapi+yaml',
    },
  });
}