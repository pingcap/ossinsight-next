import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: string }> = ({
  parameters: { owner_id },
  getRepo,
}) => {
  // const repo = getRepo(Number(org_id));

  return {
    title: `TODO Pull Request Merged Ratio ${owner_id}`,
  };
};

export default generateMetadata;
