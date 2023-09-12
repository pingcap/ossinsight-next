import { MetadataGenerator } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{
  owner_id: number;
  activity: string;
}> = ({ parameters: { owner_id, activity }, getOrg }) => {
  const main = getOrg(owner_id);
  return {
    title: `Geographical Distribution of ${owner_id}`,
  };
};

export default generateMetadata;
