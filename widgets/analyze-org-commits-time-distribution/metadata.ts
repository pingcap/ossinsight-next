import { MetadataGenerator, WidgetVisualizerContext } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: number }> = ({ parameters: { owner_id }, getUser }) => {
  // const user = getUser(user_id);

  return {
    title: `Commits Time Distribution of @${owner_id}`,
  }
};

export default generateMetadata;
