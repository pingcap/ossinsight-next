import { MetadataGenerator } from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{ user_id: string }> = ({ parameters: { user_id }, getUser }) => {
  const user = getUser(Number(user_id));

  return {
    title: `@${user.login}'s Contribution Activities`,
  };
};

export default generateMetadata;
