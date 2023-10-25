import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{
  owner_id: string;
  activity: string;
}> = ({ parameters: { owner_id, activity }, getOrg }) => {
  const main = getOrg(parseInt(owner_id));
  return {
    title: getTitle(activity),
  };
};

const getTitle = (activity: string) => {
  switch (activity) {
    case 'issue':
      return 'Which Repository Exhibit Exceptional Efficiency in Addressing Issues?';
    case 'pull-requests':
      return 'Which Repository Achieves the Shortest Pull Request Completion Time?';
    default:
      return 'Top Repos of Open to Close Time';
  }
};

export default generateMetadata;
