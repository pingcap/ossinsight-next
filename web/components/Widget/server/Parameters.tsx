import { WidgetParameters } from '@/components/Widget';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export async function ServerParameters ({ name, linkedDataPromise }: { name: string, linkedDataPromise: Promise<LinkedData> }) {
  const linkedData = await linkedDataPromise;

  return (
    <WidgetParameters widgetName={name} linkedData={linkedData} />
  );
}