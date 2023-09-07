import { MetadataGenerator, WidgetVisualizerContext } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: string,  }> = ({ parameters: { owner_id }, getRepo }) => {
  // const repo = getRepo(Number(repo_id));

  return {
    title: `TODO Active repo of ${owner_id} - Last 28 days`
  }
};

export default generateMetadata;
