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
    title: `Top repos of ${activity} completion time of ${main.login}`,
  };
};

export default generateMetadata;
