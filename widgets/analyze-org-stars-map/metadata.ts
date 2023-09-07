import { MetadataGenerator } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ owner_id: number }> = ({
  parameters: { owner_id },
  getRepo,
}) => {
  // const main = getRepo(parseInt(repo_id));
  return {
    title: `Geographical Distribution of ${owner_id}`,
  };
};

const TITLE = {
  stars: 'Star',
  'pull-request-creators': 'Pull Request Creator',
  'issue-creators': 'Issue Creator',
};

export default generateMetadata;
