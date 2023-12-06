import { WidgetParameters } from '@/components/Widget';
import { LinkedData } from '@ossinsight/widgets-core/src/parameters/resolver';

export async function ServerParameters ({ name, excludeParameters, linkedDataPromise }: { name: string, excludeParameters: string[], linkedDataPromise: Promise<LinkedData> }) {
  const linkedData = await linkedDataPromise;

  return (
    <WidgetParameters widgetName={name} linkedData={linkedData} excludeParameters={excludeParameters} />
  );
}