import { MetadataGenerator } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: number }> = ({
  parameters: { owner_id },
  getRepo,
}) => {
  // const main = getRepo(parseInt(repo_id));
  return {
    title: `Most engagement of ${owner_id}`,
  };
};

export default generateMetadata;
