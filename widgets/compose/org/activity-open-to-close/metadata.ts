import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: string; activity }> = ({
  parameters: { owner_id, activity },
  getOrg,
}) => {
  const main = getOrg(parseInt(owner_id));
  return {
    title: getTitle(activity),
  };
};

const getTitle = (activity: string) => {
  switch (activity) {
    case 'issues':
      return 'Which Repository Shows the Most Proactive Issue Responses?';
    case 'pull-requests':
      return 'Which Repository Exhibits the Quickest Response to Pull Requests?';
    default:
      return 'Top Repos of Open to Close Time';
  }
};

export default generateMetadata;
