import { widgetMeta, widgetMetadataGenerator } from '@/utils/widgets';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';
import { createWidgetContext } from '@ossinsight/widgets-core/src/utils/context';

export async function ServerWidgetInfo ({ name, linkedDataPromise, searchParams }: { name: string, linkedDataPromise: Promise<LinkedData>, searchParams: Record<string, any> }) {
  const generateMetadata = await widgetMetadataGenerator(name);
  const meta = widgetMeta(name);
  const linkedData = await linkedDataPromise;

  const metadata = generateMetadata(
    createWidgetContext('server', searchParams, linkedData),
  );

  return (
    <>
      <h1 className="text-lg text-title font-bold mb-2">{metadata.title}</h1>
      <p>{metadata.description ?? meta.description}</p>
    </>
  );
}