import { MetadataGenerator } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ repo_id: string }> = ({ parameters: { repo_id }, getRepo }) => {
  const repo = getRepo(Number(repo_id));

  return {
    title: `Activity trends for ${repo.fullName}`,
  };
};

export default generateMetadata;
