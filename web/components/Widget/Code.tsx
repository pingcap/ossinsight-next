import { createShareInfo } from '@/components/Share/utils';
import { widgetParameterDefinitions } from '@/utils/widgets';
import { AnalyzeTuple } from '@ossinsight/ui/src/components/AnalyzeSelector';
import { CodeBlock } from '@ossinsight/ui/src/components/CodeBlock';
import { htmlCode, ShareOptions } from '@ossinsight/ui/src/components/ShareBlock';
import { ParametersContext } from '@ossinsight/widgets-core/src/parameters/react/context';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { useContext, useEffect, useState, useTransition } from 'react';

export function Code ({ name: fullName, tuple, onPrepared }: { name: string | undefined, tuple: AnalyzeTuple, onPrepared: (options: ShareOptions | undefined, params: any) => void }) {
  const [shareInfo, setShareInfo] = useState<ShareOptions>();
  const [params, setParams] = useState<any>();
  const [transitioning, startTransition] = useTransition();
  const [waiting, setWaiting] = useState(false);

  const { linkedData } = useContext(ParametersContext);

  useEffect(() => {
    setWaiting(true);
    startTransition(async () => {
      setShareInfo(undefined);
      setParams(undefined);
      if (fullName == null || tuple.value == null) {
        setWaiting(false);
        return;
      }
      const { vendor, name } = parseName(fullName);
      const parameters = await widgetParameterDefinitions(fullName);
      let flag = false;
      let skip = false;
      const params = Object.entries(parameters).reduce((res, [k, v]) => {
        if (!flag && v.type === 'repo-id' && tuple.type === 'repo' && tuple.value != null) {
          res[k] = tuple.value.id;
          flag = true;
        } else if (!flag && v.type === 'user-id' && tuple.type === 'user' && tuple.value != null) {
          res[k] = tuple.value.id;
          flag = true;
        } else if (['user-id', 'repo-id'].includes(v.type)) {
        } else if (v.default != null) {
          res[k] = v.default;
        }
        return res;
      }, {} as any);
      if (skip) {
        setWaiting(false);
        return;
      }

      await resolveParameters(parameters, params, linkedData);
      setShareInfo(await createShareInfo(fullName, name, vendor, linkedData, params));
      setParams(params);
      setWaiting(false);
    });
  }, [fullName, tuple]);

  useEffect(() => {
    onPrepared(shareInfo, params);
  }, [shareInfo, onPrepared, params]);

  let code: string;
  let language: 'html' | 'markdown';

  if (transitioning || waiting) {
    code = 'Loading...';
    language = 'markdown';
  } else if (!shareInfo || !tuple.value) {
    code = `Please select a ${tuple.type}`;
    language = 'markdown';
  } else {
    const { title, keywords, imageWidth, url, thumbnailUrl } = shareInfo;
    code = htmlCode('auto', title, url, thumbnailUrl, imageWidth);
    language = 'html';
  }

  return (
    <CodeBlock
      className="lg:h-full"
      code={code}
      language={language}
      wrap
      copyButtonClassName="top-auto right-auto bottom-8 left-1/2 -translate-x-1/2"
      copyButtonContent="Copy and Paste it into README.md"
      heading="Code"
    />
  );
}

function parseName (name: string): { vendor: string, name: string } {
  if (name.startsWith('@ossinsight/widget-')) {
    return {
      vendor: 'official',
      name: name.replace('@ossinsight/widget-', ''),
    };
  } else {
    throw new Error('not supported widget');
  }
}
