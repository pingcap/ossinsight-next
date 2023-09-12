import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: number }> = ({
  parameters: { owner_id },
  getOrg,
}) => {
  const main = getOrg(owner_id);

  return {
    title: `Commits Time Distribution of ${main.login}`,
  };
};

export default generateMetadata;
