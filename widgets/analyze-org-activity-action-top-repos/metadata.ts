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

export default generateMetadata;
