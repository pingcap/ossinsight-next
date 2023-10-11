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
    title: `Ranking of repos with the most ${activity.split('/')[1]} in ${
      main.login
    }`,
  };
};

const getTitle = (activity: string) => {
  switch (activity) {
    case 'issues/issue-comments':
      return 'Which repositories are actively engaged in issue discussions?';
    case 'reviews/review-comments':
      return 'Which Repository Generates the Most Discussion during Pull Request Reviews?';
    default:
      return 'Ranking of repos';
  }
};

export default generateMetadata;
