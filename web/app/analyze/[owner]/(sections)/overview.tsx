'use client';
import SectionTemplate from '@/components/Analyze/Section';
import ChartTemplate from '@/components/Analyze/Section/Chart';
import { getWidgetSize } from '@ossinsight/widgets-utils/src/utils';

export default function OverviewContent() {
  return (
    <SectionTemplate title='Overview' level={2} className='pt-8'>
      <div className='flex gap-[var(--site-widget-gap)] w-full flex-wrap'>
        <div className='flex flex-col gap-[var(--site-widget-gap)] overflow-x-auto'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-overview-stars'
            width={getWidgetSize().widgetWidth(6, 2)}
            height={getWidgetSize().widgetWidth(2)}
            innerSectionId='star-growth'
          />
          <div className='flex gap-[var(--site-widget-gap)]'>
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'pull-requests',
              }}
              width={getWidgetSize().widgetWidth(2)}
              height={getWidgetSize().widgetWidth(2)}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'reviews',
              }}
              width={getWidgetSize().widgetWidth(2)}
              height={getWidgetSize().widgetWidth(2)}
            />
            <ChartTemplate
              name='@ossinsight/widget-compose-org-overview-stats'
              searchParams={{
                activity: 'issues',
              }}
              width={getWidgetSize().widgetWidth(2)}
              height={getWidgetSize().widgetWidth(2)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-[var(--site-widget-gap)]'>
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-contributors'
            searchParams={{
              activity: 'active',
            }}
            width={getWidgetSize().widgetWidth(3)}
            height={getWidgetSize().widgetWidth(2)}
          />
          <ChartTemplate
            name='@ossinsight/widget-compose-org-active-contributors'
            searchParams={{
              activity: 'new',
            }}
            width={getWidgetSize().widgetWidth(3)}
            height={getWidgetSize().widgetWidth(2)}
          />
        </div>
        <ChartTemplate
          name='@ossinsight/widget-compose-org-activity-active-ranking'
          searchParams={{
            activity: 'repos',
          }}
          width={getWidgetSize().widgetWidth(3)}
          height={getWidgetSize().widgetWidth(4, 1)}
        />
      </div>
    </SectionTemplate>
  );
}
