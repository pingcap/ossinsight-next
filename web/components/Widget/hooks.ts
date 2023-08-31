import { createShareInfo } from '@/components/Share/utils';
import { widgetParameterDefinitions } from '@/utils/widgets';
import { AnalyzeTuple } from '@ossinsight/ui/src/components/AnalyzeSelector';
import { ShareOptions } from '@ossinsight/ui/src/components/ShareBlock';
import { ParametersContext } from '@ossinsight/widgets-core/src/parameters/react/context';
import { resolveParameters } from '@ossinsight/widgets-core/src/parameters/resolver';
import { useContext, useEffect, useMemo, useState, useTransition } from 'react';

export function useWidgetShareInfo (fullName: string | undefined, tuple: AnalyzeTuple) {
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
  }, [fullName, tuple.type, tuple.value, linkedData]);

  const editReadmeUrl = useMemo(() => {
    if (!tuple.value) {
      return undefined;
    }
    switch (tuple.type) {
      case 'repo': {
        const repo = linkedData.repos[String(tuple.value.id)];
        if (!repo) {
          return undefined;
        }
        const { fullName, defaultBranch } = repo;
        return `https://github.com/${fullName}/edit/${defaultBranch}/README.md`;
      }
      case 'user': {
        const login = linkedData.users[String(tuple.value.id)]?.login;
        if (!login) {
          return undefined;
        }
        return `https://github.com/${login}/${login}`;
      }
      default:
        return undefined;
    }
  }, [waiting, transitioning, tuple.type, tuple.value?.id]);

  return {
    shareInfo,
    params,
    editReadmeUrl,
    loading: waiting || transitioning,
  };
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
