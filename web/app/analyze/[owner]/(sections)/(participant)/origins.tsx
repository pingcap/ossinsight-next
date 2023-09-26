'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { AnalyzeOrgContext } from '@/components/Context/Analyze/AnalyzeOrg';
import {
  CompanyRankTable,
  GeoRankTable,
} from '@/components/Analyze/Table/RankTable';
import { useSimpleSelect } from '@ossinsight/ui/src/components/Selector/Select';
import { upperFirst, getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function OriginsContent() {
  const { orgName, orgId } = React.useContext(AnalyzeOrgContext);

  return (
    <SectionTemplate
      title='Participant'
      description='Examine participation dynamics within your organization, analyzing participant activity, engagement depth, roles, affiliations, and geographic distribution. Uncover valuable insights into participate involvement, preferences, and demographics, enabling targeted strategies for enhanced engagement and tailored experiences.'
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        id='origins'
        title='Origins'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <OrgActivityCompany orgId={orgId} />
        </div>
        <div className='flex gap-4 flex-wrap w-full h-fit overflow-x-auto'>
          <OrgActivityMap orgId={orgId} />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}

function RoleInput({
  id,
  onValueChange,
  value = 'pr_creators',
}: {
  id: string;
  value?: string;
  onValueChange: (newValue: string | undefined) => void;
}) {
  const options = [
    'pr_creators',
    'pr_reviewers',
    'pr_commenters',
    'issue_creators',
    'issue_commenters',
    'commit_authors',
  ].map((r) => ({
    key: r,
    title: upperFirst(r.split('_').join(' ')),
  }));

  const { select: roleSelect, value: role } = useSimpleSelect(
    options,
    options.find((i) => i.key === value) || options[0],
    id
  );

  React.useEffect(() => {
    onValueChange && onValueChange(role);
  }, [onValueChange, role]);

  return <>{roleSelect}</>;
}

function OrgActivityCompany(props: { orgId?: number }) {
  const { orgId } = props;

  const [role, setRole] = React.useState<string>('pr_creators');

  const handleChangeRole = React.useCallback((newValue?: string) => {
    newValue && setRole(newValue);
  }, []);

  return (
    <>
      <ChartTemplate
        key={role}
        name='@ossinsight/widget-compose-org-activity-company'
        searchParams={{
          activity: 'participants',
          role,
        }}
        width={getWidgetSize().widgetWidth(9)}
        height={405}
      >
        <div className='absolute top-10 left-5'>
          <RoleInput
            id='role-co'
            value={role}
            onValueChange={handleChangeRole}
          />
        </div>
      </ChartTemplate>
      <CompanyRankTable
        id={orgId}
        type='participants'
        className={`w-[272px] h-[405px] overflow-x-hidden overflow-auto styled-scrollbar`}
        role={role}
      />
    </>
  );
}

function OrgActivityMap(props: { orgId?: number }) {
  const { orgId } = props;

  const [role, setRole] = React.useState<string>('pr_creators');

  const handleChangeRole = React.useCallback((newValue?: string) => {
    newValue && setRole(newValue);
  }, []);

  return (
    <>
      <ChartTemplate
        key={role}
        name='@ossinsight/widget-compose-org-activity-map'
        searchParams={{
          activity: 'participants',
          role,
        }}
        width={getWidgetSize().widgetWidth(9)}
        height={365}
      >
        <div className='absolute top-10 left-5'>
          <RoleInput
            id='role-map'
            value={role}
            onValueChange={handleChangeRole}
          />
        </div>
      </ChartTemplate>
      <GeoRankTable
        id={orgId}
        type='participants'
        role={role}
        className={`w-[272px] h-[365px] overflow-x-hidden overflow-auto styled-scrollbar`}
      />
    </>
  );
}
