'use client';
import * as React from 'react';

import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';

export default function EngagementContent() {
  return (
    <SectionTemplate
      title='Participant'
      description='Examine participation dynamics within your organization, analyzing participant activity, engagement depth, roles, affiliations, and geographic distribution. Uncover valuable insights into participate involvement, preferences, and demographics, enabling targeted strategies for enhanced engagement and tailored experiences.'
      level={2}
      className='pt-8'
    >
      <SectionTemplate
        title='Engagement'
        level={3}
        className='pt-8 flex flex-col gap-4'
      >
        <div className='flex gap-4 flex-wrap w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-growth'
            searchParams={{
              activity: 'participants',
            }}
            width={648}
            height={389}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-activity-active-ranking'
            searchParams={{
              activity: 'participants',
            }}
            width={216}
            height={389}
          />
        </div>
        <div className='w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-participants-roles-ratio'
            searchParams={{}}
            width={864 + 16}
            height={259}
          />
        </div>
        <div className='w-full overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-engagement-scatter'
            searchParams={{}}
            width={864 + 16}
            height={518}
          />
        </div>
      </SectionTemplate>
    </SectionTemplate>
  );
}
