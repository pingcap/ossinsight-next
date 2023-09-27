'use client';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  GHOrgRepoSelector,
  RemoteRepoInfo,
  HLGHOrgRepoSelector,
} from '@ossinsight/ui/src/components/GHRepoSelector';
import { Button } from '@ossinsight/ui/src/components/Button';
import { CalendarIcon } from '@primer/octicons-react';

import {
  AnalyzeOwnerContext,
} from '@/components/Context/Analyze/AnalyzeOwner';
import {
  HLSelect,
  SelectParamOption,
} from '@ossinsight/ui/src/components/Selector/Select';

import { getRepoInfoById } from '@/components/Analyze/utils';

const options = [
  { key: 'past_7_days', title: 'Past 7 days' },
  { key: 'past_28_days', title: 'Past 28 days' },
  { key: 'past_90_days', title: 'Past 90 days' },
  { key: 'past_12_months', title: 'Past 12 months' },
];

export default function OrgAnalyzePageHeaderAction() {
  const searchParams = useSearchParams();

  const [repos, setRepos] = React.useState<
    Omit<RemoteRepoInfo, 'defaultBranch'>[]
  >([]);
  const [loadingRepoFromUrl, setLoadingRepoFromUrl] =
    React.useState<boolean>(true);
  const [currentRepoIds, setCurrentRepoIds] = React.useState<number[]>(stringArray2NumberArray(searchParams.getAll('repoIds')) || []);
  const [currentPeriod, setCurrentPeriod] = React.useState<string>(searchParams.get('period') || options[1].key);

  const { name: orgName, id: orgId } =
    React.useContext(AnalyzeOwnerContext);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setCurrentRepoIds(
      stringArray2NumberArray(searchParams.getAll('repoIds')) || []
    );
    setCurrentPeriod(searchParams.get('period') || options[1].key);
  }, [searchParams]);

  const handlePeriodChange = (v: SelectParamOption<string>) => {
    setCurrentPeriod(v.key);
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    const urlPeriod = currentParams.get('period') || options[1].key;
    if (urlPeriod !== v.key) {
      currentParams.set('period', v.key);
      typeof window !== 'undefined' &&
        window.location.replace(pathname + '?' + currentParams.toString());
    }
  };

  // load repo from url
  React.useEffect(() => {
    const handler = async () => {
      if (!currentRepoIds) {
        setLoadingRepoFromUrl(false);
        return;
      }
      const repoInfos = await Promise.all(
        currentRepoIds.map((id) => getRepoInfoById(id))
      );
      const filteredRepoInfos = repoInfos.filter((r) =>
        r.fullName.startsWith(`${orgName}/`)
      );
      setRepos(filteredRepoInfos);
      setLoadingRepoFromUrl(false);
    };
    handler();
  }, [currentRepoIds, orgId, orgName]);

  const handleApplyRepoIdsChanges = (input: RemoteRepoInfo[]) => {
    // get param from url
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    // update repoId
    const selectedRepoIds = input.map((r) => r.id);
    if (!isArrayItemsEqual(currentRepoIds, selectedRepoIds)) {
      currentParams.delete('repoIds');
      selectedRepoIds.forEach((id) => currentParams.append('repoIds', `${id}`));

      typeof window !== 'undefined' &&
        window.location.replace(pathname + '?' + currentParams.toString());
    }
  };

  return (
    <>
      {/* -- action bar -- */}
      <div className='sticky top-[var(--site-header-height)] flex gap-x-6 gap-y-2 flex-wrap flex-col md:flex-row md:items-end py-4 bg-[var(--background-color-body)] z-10'>
        {currentPeriod && (
          <HLSelect
            options={options}
            value={options.find((i) => i.key === currentPeriod) || options[1]}
            onChange={handlePeriodChange}
            startIcon={<CalendarIcon />}
          />
        )}
        <div className='relative'>
          {orgId && (
            <HLGHOrgRepoSelector
              disabled={loadingRepoFromUrl}
              ownerId={orgId}
              defaultSelectedIds={currentRepoIds}
              onComplete={(input) => {
                const inputRepos = input.map((r) => ({
                  id: r.id,
                  fullName: r.fullName,
                  defaultBranch: '',
                }));
                handleApplyRepoIdsChanges(inputRepos);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

function renderInput(props: any) {
  return <input className='TextInput' {...props} type={undefined} />;
}

function isArrayItemsEqual(a: any[], b: any[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((item) => b.includes(item));
}

function stringArray2NumberArray(arr: (string | number)[]) {
  return arr.reduce((acc: number[], cur: string | number) => {
    try {
      const num = Number(cur);
      if (isNaN(num)) {
        throw new Error('NaN');
      }
      acc.push(num);
    } catch (e) {
      console.error(e);
    }
    return acc;
  }, []);
}
