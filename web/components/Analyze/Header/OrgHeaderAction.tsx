'use client';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  GHOrgRepoSelector,
  RemoteRepoInfo,
} from '@ossinsight/ui/src/components/GHRepoSelector';
import { Button } from '@ossinsight/ui/src/components/Button';
import { CalendarIcon } from '@primer/octicons-react';

import {
  AnalyzeOrgContextProps,
  AnalyzeOrgContext,
} from '@/components/Context/Analyze/AnalyzeOrg';
import { useSimpleSelect } from '@ossinsight/ui/src/components/Selector/Select';

import { getRepoInfoById } from '@/components/Analyze/utils';

const options = [
  { key: 'past_7_days', title: 'Past 7 days' },
  { key: 'past_28_days', title: 'Past 28 days' },
  { key: 'past_90_days', title: 'Past 90 days' },
  { key: 'past_12_months', title: 'Past 12 months' },
];

export default function OrgAnalyzePageHeaderAction() {
  const [repos, setRepos] = React.useState<RemoteRepoInfo[]>([]);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [loadingRepoFromUrl, setLoadingRepoFromUrl] =
    React.useState<boolean>(true);
  const [currentRepoIds, setCurrentRepoIds] = React.useState<string[]>([]);
  const [currentPeriod, setCurrentPeriod] = React.useState<string>(
    options[1].key
  );

  const { orgName, orgId } =
    React.useContext<AnalyzeOrgContextProps>(AnalyzeOrgContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    setCurrentRepoIds(searchParams.getAll('repoIds') || []);
    setCurrentPeriod(searchParams.get('period') || options[0].key);
  }, [searchParams]);

  const { select: periodSelect, value: periodSelected } = useSimpleSelect(
    options,
    options.find((i) => i.key === currentPeriod) || options[0],
    'period-select',
    <CalendarIcon />
  );

  const handleSelectRepo = (repo: RemoteRepoInfo | undefined) => {
    !editMode && setEditMode(true);
    if (!repo) {
      return;
    }
    setRepos([...repos, repo]);
  };
  const handleRemoveRepo = (repo: RemoteRepoInfo) => {
    !editMode && setEditMode(true);
    setRepos(repos.filter((r) => r.id !== repo.id));
  };

  React.useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    const urlPeriod = currentParams.get('period') || options[0].key;
    if (urlPeriod !== periodSelected) {
      currentParams.set('period', periodSelected);
      router.push(pathname + '?' + currentParams.toString());
    }
  }, [pathname, periodSelected, router, searchParams]);

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

  const handleApplyRepoIdsChanges = () => {
    // get param from url
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );
    // update repoId
    const selectedRepoIds = repos.map((r) => r.id);
    if (!isArrayItemsEqual(currentRepoIds, selectedRepoIds)) {
      currentParams.delete('repoIds');
      selectedRepoIds.forEach((id) => currentParams.append('repoIds', `${id}`));
    }
    typeof window !== 'undefined' &&
      window.location.replace(pathname + '?' + currentParams.toString());
  };

  return (
    <>
      {/* -- action bar -- */}
      <div className='sticky top-[var(--site-header-height)] flex gap-x-6 gap-y-2 flex-wrap flex-col md:flex-row md:items-end py-4 bg-[var(--background-color-body)] z-10'>
        {periodSelect}
        <GHOrgRepoSelector
          repos={repos}
          onRepoSelected={handleSelectRepo}
          renderInput={renderInput}
          onRepoRemoved={handleRemoveRepo}
          orgName={orgName}
          disableInput={loadingRepoFromUrl}
          maxItems={5}
        />
        {editMode && (
          <div className='w-full'>
            <Button
              className=''
              variant='primary'
              onClick={handleApplyRepoIdsChanges}
            >
              Apply Changes
            </Button>
          </div>
        )}
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
