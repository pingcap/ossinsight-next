import {
  MetadataGenerator,
  WidgetVisualizerContext,
} from '@ossinsight/widgets-types';

const generateMetadata: MetadataGenerator<{
  owner_id: string;
  activity: string;
  period: string;
}> = ({ parameters: { owner_id, activity, period }, getOrg }) => {
  const org = getOrg(Number(owner_id));

  return {
    title: `${upperCaseFirstLetter(activity)} participants of ${
      org.login
    } - ${period.split('_').join(' ')}`,
  };
};

const upperCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default generateMetadata;
